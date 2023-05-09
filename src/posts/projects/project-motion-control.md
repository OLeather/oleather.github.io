---
title: "Motion Control"
author: Owen Leather
date: August 25, 2021
tags: [vision, frc, robotics, controls]
description: Project showcase of my motion control code
image: images/motion/motion-control-thumbnail.jpg
---
# Motion Control
While I was a student on FIRST Robotics Team 1351, I implemented many motion control algorithms onto our robot. Motion control interested me because I found it fascinating to get faster, more precise, and more efficient movement out of a robotic mechanisms using code and mathematics.

<video src="/images/videos/IMG-2423.MOV" class="h-96 aspect-video" controls=""></video>
#### Autonomous Motion Control


## Library
Throughout my time on the team, I developed a large library that features many different motion control algorithms. <i class="fa fa-github"></i> [tko-libraries](https://github.com/MittyRobotics/tko-libraries) Although motion control in robotics is very well documented and there are existing libraries that exist to implement many of these algorithms, I wanted to truly understand how they worked myself, so I researched and recreated many of them in my library. I also created some of my own algorithms in the library.

## Motion Profiling
Motion profiling was the first challenge I tackled. A "motion profile" is essentially a graph of a mechanism's state (position, velocity, acceleration, etc) over time. Motion profiles try to move the mechanism to a desired state while maintaining certain constraints about the mechanism, such as it's maximum velocity, acceleration, etc, which makes the motion smoother and safer for the mechanism. I implemented both a trapezoidal motion profile (which takes in 2 constraints: max velocity and acceleration) and an s-curve motion profile (which takes in 3 constraints: max velocity, acceleration, and jerk). The greater the number of constraints the profile takes in, the smoother the motion becomes but the more complicated the motion profile gets to calculate. Despite the challenges of increasing the number of constraints, I recently wanted to try achieving a long-term goal of mine: to create a motion profile that can be calculated given any number of constraints. Generally motion profiles are fixed to a certain number of constraints, but using a recursive calculus-based algorithm, I was able to create a motion profile that takes in any number of constraints and calculates a trajectory for a mechanism to reach it's desired state. From what I know, this is the first motion profile generator that can take in any number of constraints. <i class="fa fa-github"></i> [N-th Degree Motion Profile Generator](https://github.com/OLeather/control-theory/blob/main/control-motion/src/commonMain/kotlin/control/profiles/NMotionProfile.kt)

<video src="/images/videos/IMG-1480.MOV" class="h-96 aspect-video" controls=""></video>
#### First Implementation of Motion Profile in 2019


## Autonomous Navigation
The next motion control algorithm I wanted to implement was an autonomous navigation system. In recent times, spline drivetrain following algorithms have been quite common in FRC, but I wanted to tackle a common issue with most of them that I've seen, which is their inefficiency when it comes to initial calculations. Generally, a trajectory must be calculated all at once in order to ensure the robot doesn't move too fast around corners or violate any of it's constraints (max velocity, acceleration, angular velocity, etc). I worked on developing an entirely realtime autonomous navigation system, which can generate paths and plan it's trajectory without any pre-calculations required. In fact, the trajectory itself can be changed at any point during the following without taking a performance hit. It works similar to a road paver: it paves the road ahead of it while driving on the road behind it. The trajectory is generated as the robot follows it, generating future points as it traverses prior points. The robot's constraints are maintained by sampling future points of the trajectory and ensuring that the robot's current state will not violate any of it's future required states. The result is an entirely realtime autonomous navigation system that allows the robot to follow spline paths while maintaining the drivetrain's linear and angular motion constraints. <i class="fa fa-github"></i> [Dynamic Drivetrain Trajectory Generator](https://github.com/MittyRobotics/tko-libraries/blob/main/motion/src/commonMain/kotlin/com.github.mittyrobotics.motion/profiles/PathMotionProfile.kt)

<video src="/images/videos/main-video-3.mp4" class="h-96 aspect-video" controls=""></video>
#### Autonomous Navigation Simulations

## Turret Lock System
During the 2021 season, I developed a turret lock system that allowed our robot's turret mechanism to lock onto a target on the field to shoot balls into, and could even score balls into the target while the robot was in motion. The system worked by combining computer vision 3D position calculations with onboard sensors measuring the drivetrain's velocity to create an accurate field-relative estimation of the robot's position. The sensors were combined using a Kalman Filter, which combines the noisy but absolute position from computer vision localization with the less noisy but drift-prone onboard encoder sensors to calculate the most likely position at any given time. Using a good estimation of the robot's state on the field (including absolute position and velocity), a control loop was developed to allow the turret to be aimed at a target location on the field and even counteract the robot's motion to score balls while the robot is in motion.

<video src="/images/videos/main-video-5.mp4" class="h-96 aspect-video" controls=""></video>
#### Turret Lock Demonstration

## Awards
<img src="/images/cv/award1.jpg" class="object-cover h-96 aspect-square mx-auto"></img>
#### Awards

In 2021, our team won the Autonomous Award sponsored by Ford at our regional FRC tournament for the turret lock system, featuring a combination of computer vision and motion control.