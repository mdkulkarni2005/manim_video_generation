import React, { useState } from 'react';

interface FeatureSection {
  title: string;
  content: string[];
}

const FutureFeatures: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const featureSections: FeatureSection[] = [
    {
      title: "Using code-server's built-in features",
      content: [
        "Tasks: VS Code's tasks feature allows you to define and execute commands within the code-server terminal. Configure these in a tasks.json file to automate various workflows.",
        "Extensions: Explore VS Code extensions that can automate tasks related to your specific needs, such as those for Manim or other animation frameworks."
      ]
    },
    {
      title: "Using external tools",
      content: [
        "VS Code tasks: Leverage VS Code tasks to automate terminal commands when running code-server.",
        "Systemd: Ensure that code-server and its terminal start automatically after a server reboot using 'sudo systemctl enable code-server'.",
        "Install scripts: Utilize the code-server's install script for an automated installation process.",
        "Containerization (e.g., Docker): Automate the setup within the container for containerized environments."
      ]
    },
    {
      title: "Example scenarios",
      content: [
        "Automating server startup: Use VS Code tasks to automatically run a command to start your animation rendering server.",
        "Automating code linting: Use VS Code tasks to automatically run a linter on your Manim code.",
        "Automating packaging or deployment: Use VS Code tasks to automate the packaging or deployment of your animations."
      ]
    },
    {
      title: "Key considerations",
      content: [
        "Security: Be mindful of security implications when automating tasks, especially those with sensitive data.",
        "Permissions: Ensure the user running code-server has necessary permissions to execute commands.",
        "Dependencies: Make sure all necessary dependencies for automated tasks are installed correctly."
      ]
    }
  ];

  const toggleSection = (index: number) => {
    if (expandedSection === index) {
      setExpandedSection(null);
    } else {
      setExpandedSection(index);
    }
  };

  return (
    <div className="future-features">
      <h2 className="features-title">Terminal Automation - Future Feature</h2>
      <p className="features-description">
        Here are ways to automate the code-server terminal for a more streamlined animation generation workflow:
      </p>
      
      <div className="features-accordion">
        {featureSections.map((section, index) => (
          <div key={index} className="feature-section">
            <button 
              className={`section-header ${expandedSection === index ? 'active' : ''}`} 
              onClick={() => toggleSection(index)}
            >
              {section.title}
              <span className="toggle-icon">{expandedSection === index ? '−' : '+'}</span>
            </button>
            
            {expandedSection === index && (
              <div className="section-content">
                <ul>
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FutureFeatures;
