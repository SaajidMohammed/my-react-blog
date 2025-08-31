import React from 'react';
import './About.css';
// You can replace this placeholder with your own image.
// For example: import profilePic from '../../assets/my-photo.jpg';
import profilePic from '../../assets/logo1.png'; // Placeholder image

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">About Me</h1>
      <div className="about-content">
        <div className="about-image">
          <img src={profilePic} alt="A portrait of the blog author" />
        </div>
        <div className="about-text">
          <h2>Who I Am</h2>
          <p>
            Hello! I'm a passionate developer and lifelong learner based in Chennai. My fascination with technology began years ago, and it has since grown into a full-fledged career. I specialize in front-end development, with a deep love for creating intuitive, beautiful, and responsive user interfaces using tools like React.
          </p>
          <p>
            When I'm not coding, you can find me exploring the latest tech trends, contributing to open-source projects, or enjoying a strong cup of filter coffee.
          </p>
          <h2>Why I Started This Blog</h2>
          <p>
            I created this blog as a way to document my journey in the ever-evolving world of technology. It's a space for me to share my thoughts, tutorials, and discoveries with the developer community. My goal is to break down complex topics into easy-to-understand articles, hoping to help others who are on a similar path. Thank you for joining me!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;