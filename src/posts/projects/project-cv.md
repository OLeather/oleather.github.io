---
title: "Computer Vision"
author: Owen Leather
date: August 25, 2021
tags: [vision, frc, robotics, controls]
description: Project showcase of my computer vision code
image: images/cv/computer-vision-thumbnail.jpg
---

# Computer Vision

Throughout my three years on FIRST Robotics Team 1351, one of my main software projects was implementing a computer vision guidance system on the robot. Computer vision substantially increased our robot's ability to interact with game objects and navigate the field quickly and reliably.

<video src="/images/videos/cv-slider.mp4" class="h-96 aspect-video" controls=""></video>
#### Slider Alignment Demonstration


# Target Detection

I initially worked with another student to implement a computer vision target detection system using the Nvidia Jetson TX1 development board and the OpenCV c++ library. <i class="fa fa-github"></i> [Original Vision System](https://github.com/MittyRobotics/jetson-vision) The program worked well, but we ran into some networking unreliability between the Jetson board and the main robot processor. We later switched to using a Limelight, an all-in-one camera, processor, and target detection system that provided color and contour filtering at a higher refresh rate, and also provided more stable networking, allowing us to focus on the much more difficult task of computer vision-based navigation and control.

<video src="/images/videos/main-video-2.mp4" class="h-96 aspect-video" controls=""></video>
#### Vision Target Detection


# Vision Control

I implemented autonomous computer vision control into our robot's software for our 2019 and 2020 robots. For 2019, I implemented a slider alignment system that would use computer vision to automatically align a slider mechanism such that it could reliably place objects in their designated positions. I also worked on a robot alignment system that would automatically drive the robot towards the target to place the objects. For 2020, I implemented a full computer vision navigation system, which combined 3D location calculations from the vision system with onboard robot sensors in order to better track it's position on the field. That allowed for fully autonomous field navigation and an autonomous turret lock system that allowed the robot to score balls in the target even while the robot was in motion.

<video src="/images/videos/robot-video.mp4" class="h-96 aspect-video" controls=""></video>
#### Vision Target Detection
