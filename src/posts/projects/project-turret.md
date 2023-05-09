---
title: "Turret Lock"
author: Owen Leather
date: August 25, 2021
tags: [vision, frc, robotics, controls]
description: Project showcase of my turret lock code
image: images/cv/main-video-5_Moment.jpg
---

# Turret Lock System

<video src="/images/videos/robot-video.mp4" class="w-full" controls=""></video>
#### Turret Lock Demonstration

During the 2021 season, I developed a turret lock system that allowed our robot's turret mechanism to lock onto a target on the field to shoot balls into, and could even score balls into the target while the robot was in motion. The system worked by combining computer vision 3D position calculations with onboard sensors measuring the drivetrain's velocity to create an accurate field-relative estimation of the robot's position. The sensors were combined using a Kalman Filter, which combines the noisy but absolute position from computer vision localization with the less noisy but drift-prone onboard encoder sensors to calculate the most likely position at any given time. Using a good estimation of the robot's state on the field (including absolute position and velocity), a control loop was developed to allow the turret to be aimed at a target location on the field and even counteract the robot's motion to score balls while the robot is in motion.

<video src="/images/videos/IMG-4064.mp4" class="w-1/2 mx-auto" controls=""></video>
#### Kalman Filter Pose Estimation

## Source Code
The main turret control loop is found under <i class="fa fa-github"></i> [Autonomous.java](https://github.com/MittyRobotics/tko2020/blob/c16df7195f4e10d1a7d97ec1ba8e98f49038f9f1/src/main/java/com/github/mittyrobotics/autonomous/Autonomous.java) file in the GitHub repository for our team's 2020-2021 robot. The Autonomous service deals with controlling the turret and shooter subsystems based on the turret lock control algorithm. It relies upon the <i class="fa fa-github"></i> [RobotPositionTracker.java](https://github.com/MittyRobotics/tko2020/blob/c16df7195f4e10d1a7d97ec1ba8e98f49038f9f1/src/main/java/com/github/mittyrobotics/autonomous/util/RobotPositionTracker.java) service which is a kalman filter-based pose estimator. It also uses the <i class="fa fa-github"></i> [Vision.java](https://github.com/MittyRobotics/tko2020/blob/c16df7195f4e10d1a7d97ec1ba8e98f49038f9f1/src/main/java/com/github/mittyrobotics/autonomous/Vision.java) service which localizes the robot according to perceived vision targets. The code relies upon my controls library, <i class="fa fa-github"></i> [tko-libraries-legacy](https://github.com/MittyRobotics/tko-libraries-legacy) for mathematics helper functions, geometry classes, and robot kinematics calculations.

## Explanation of Code
The first step of the turret lock system is to collect all the data required for the control loops. Most notably, the current pose and dynamics estimations are gathered from the RobotPositionTracker service, as well as info about the vision target's perceived location from the Vision service. Future robot pose is also roughly predicted given current robot dynamics, which is used for a velocity feedforward on the turret.

```java
public void run(){
    //Update delta time
    double time = Timer.getFPGATimestamp();
    double dt = lastTime == 0? 0.02:time-lastTime;
    lastTime = time;

    //Get vision angle and vision angle velocity from Vision
    double visionAngle = visionAngleFilter.calculate(Vision.getInstance().getLatestTarget().yaw.getDegrees());
    double visionAngleVelocity = (visionAngle-lastVisionAngle)/dt;
    lastVisionAngle = visionAngle;

    //Get vision distance from Vision
    double visionDistance = visionDistanceFilter.calculate(Vision.getInstance().getLatestTarget().distance);

    //Get the robot's current velocity transform relative to the field and current velocity state
    Transform fieldVelocity = RobotPositionTracker.getInstance().getFilterState().getRotatedVelocityTransform(
            RobotPositionTracker.getInstance().getFilterTransform().getRotation());
    //Filter field velocity
    //    fieldVelocity = new Transform(
    //            fieldVelocityYFilter.calculate(fieldVelocity.getPosition().getY()),
    //            fieldVelocityXFilter.calculate(fieldVelocity.getPosition().getX()),
    //            fieldVelocityRotFilter.calculate(fieldVelocity.getRotation().getRadians())
    //    );

    //Get current robot transform
    Transform currentRobotTransform = RobotPositionTracker.getInstance().getFilterTransform();
    //Predict next robot transform given current transform and velocity
    Transform nextRobotTransform = fieldVelocity.multiply(dt).add(currentRobotTransform);

    //Calculate current field rotation from robot to target
    double currentFieldRotation = AutonCoordinates.SCORING_TARGET.angleTo(currentRobotTransform.getPosition()).getDegrees();
    //Calculate next field rotation from robot to target
    double nextFieldRotation = AutonCoordinates.SCORING_TARGET.angleTo(nextRobotTransform.getPosition()).getDegrees();
    //Calculate change in field rotation over change in time for linear movement
    double linearRotationVelocity = -(nextFieldRotation-currentFieldRotation)/dt;
    //Calculate shooter RPM and turret output
    autoShooterRPM = calculateShooter(visionDistance, fieldVelocity);
    autoTurretOutput = calculateTurret(visionAngle, visionAngleVelocity, linearRotationVelocity, fieldVelocity, dt);
}
```

The RobotPositionTracker service uses a simplified kalman filter that estimates 2D field pose based on drivetrain kinematics and computer vision 3D localization. Shown below are the input functions for kinematics state measurements and vision measurements.

```java
public void addStateMeasurement(DrivetrainState measurement){
    double time = Timer.getFPGATimestamp();
    double dt = time-lastStateMeasurementTime;
    lastStateMeasurementTime = time;
    Position deltaPosition = measurement.getRotatedVelocityTransform(getFilterTransform().getRotation()).multiply(dt).getPosition();
    SimpleMatrix u = new SimpleMatrix(new double[][]{
            {deltaPosition.getX()/dt},
            {deltaPosition.getY()/dt}
    });
    filter.predict(u);
}

public void addVisionMeasurement(Position visionPosition){
    SimpleMatrix z = new SimpleMatrix(new double[][]{
            {visionPosition.getX()},
            {visionPosition.getY()},
            {filter.getxHat().get(2)},
            {filter.getxHat().get(3)}
    });
    filter.correct(z);
}
```

The Vision service uses the 2D coordinates of the target from the vision camera and some physical parameters of the target (i.e., it's height from the ground and location on the field) to derive a 3D pose estimation. That is used by the RobotPositionTracker's kalman filter as a global pose estimate. Safety checks are also done to ensure vision data is recent and reasonable compared to previous data and known constants of the field. If vision data is not currently safe to use, the pose estimator can continue to run using only drivetrain kinematics state estimates, and will be corrected as soon as vision data is safe again.

```java
public void run() {
    //Update limelight values
    Limelight.getInstance().updateLimelightValues();
    //Get limelight pitch and yaw
    Rotation llYaw = Rotation.fromDegrees(Limelight.getInstance().getYawToTarget()).inverse();
    Rotation llPitch = Rotation.fromDegrees(Limelight.getInstance().getPitchToTarget());
    //Calculate distance to target
    double distance = calculateDistanceToTarget(llPitch);
    //Update latest vision target
    latestTarget = new VisionTarget(llYaw, llPitch, distance);

    //Get robot and turret transforms
    Rotation robotRotation = RobotPositionTracker.getInstance().getFilterTransform().getRotation();
    Rotation turretRotation = TurretSubsystem.getInstance().getRotation();

    //Calculate camera transform relative to target
    Transform cameraTransform = Vision.getInstance().calculateCameraRelativeTransform(latestTarget);
    //Calculate turret transform relative to target
    Transform turretTransform = Vision.getInstance().calculateTurretRelativeTransform(cameraTransform);

    //Calculate turret transform relative to field
    Transform transformEstimate = Vision.getInstance().calculateTurretFieldTransform(turretTransform, turretRotation, robotRotation);
    cameraTransform.setPosition(new Position(
            xFilter.calculate(latestTurretTransformEstimate.getPosition().getX()),
            yFilter.calculate(latestTurretTransformEstimate.getPosition().getY())
    ));

    if((Math.abs(transformEstimate.getPosition().subtract(latestRobotTransformEstimate.getPosition()).getX()) > 30
            || Math.abs(transformEstimate.getPosition().subtract(latestRobotTransformEstimate.getPosition()).getX()) > 30) &&
            (latestRobotTransformEstimate.getPosition().getX() != 0 && latestRobotTransformEstimate.getPosition().getY() != 0)){
        System.out.println("Warning: Inacurate Vision Data");
        visionSafe = false;
    }
    else{
        visionSafe = true;

        latestTurretTransformEstimate = transformEstimate;

        //Calculate robot transform relative to field
        latestRobotTransformEstimate = Vision.getInstance().calculateRobotFieldTransform(latestTurretTransformEstimate, robotRotation);
    }
}
```
The control loops for both the shooter flywheel and the turret subsystems are below. The shooter uses a simplified control loop that is simply shifted up or down linearly according to the perpendicular component of the robot's velocity relative to the target. This was deemed acceptable given the normal operation of the system. The turret control loop is a multi-stage cascade control loop utilizing primarily PID loops. It controls the turret using a main position loop and a secondary velocity loop. It aims to first counteract the robot's angular velocity to maintain a constant heading in space, then adjusts the heading to point towards the target's 3D location in space, then compensates for ball trajectory in air by shifting left or right based on the robot's parallel velocity component to the target. Finally, future predicted motion is used as a velocity feedforward to improve tracking accuracy while the robot is in motion.

```java
private double calculateShooter(double visionDistance, Transform fieldVelocity){
    //Shooter calculations
    double visionRPM = getRPMFromTable(visionDistance);
    double fieldVelocityRPM = Math.abs(fieldVelocity.getPosition().getX())* LINEAR_VELOCITY_X_GAIN;
    return visionRPM + fieldVelocityRPM;
}

private double calculateTurret(double visionAngle, double visionAngleVelocity, double linearRotationVelocity, Transform fieldVelocity, double dt){
    //Calculate Y motion offset
    double yVelocityOffset = -fieldVelocity.getPosition().getY()* LINEAR_VELOCITY_Y_GAIN* Math.signum(fieldVelocity.getPosition().getX());
    //Add x motion offset to vision angle
    double offsetVision = visionAngle + yVelocityOffset;
    //Calculate vision angle PID
    double pidVoltage = offsetVision* VISION_P + visionAngleVelocity* VISION_D;

    //Counteract the current field rotation velocity
    double counteractFieldRotationVelocity = fieldVelocity.getRotation().getDegrees()* Math.signum(-fieldVelocity.getPosition().getX());

    //Counteract the linear movement velocity
    double counteractLinearMovementVelocity = linearRotationVelocity* LINEAR_MOVEMENT_ROTATION_VELOCITY_GAIN* Math.signum(fieldVelocity.getPosition().getX());

    if(DriverStation.getInstance().isEnabled()){
        System.out.println(linearRotationVelocity + " " + counteractLinearMovementVelocity + " " + counteractFieldRotationVelocity + " " + fieldVelocity ) ;
    }


    double oldF = TURRET_VELOCITY_F;
    TURRET_VELOCITY_F = fieldVelocity.getPosition().getX() < 0? 12/300.0 : oldF;

    //Calculate final counteraction velocity with countracted field rotation and counteracted linear movement
    double desiredVelocity = counteractFieldRotationVelocity+counteractLinearMovementVelocity;

    //Turret PF loop
    double velVoltage = desiredVelocity* TURRET_VELOCITY_F +
            (desiredVelocity-TurretSubsystem.getInstance().getVelocity()) * TURRET_VELOCITY_P;

    TURRET_VELOCITY_F = oldF;
    //Combine position and velocity loop outputs
    double turretVoltage = pidVoltage + velVoltage;

    //return percent output
    return turretVoltage/12.0;
}
```