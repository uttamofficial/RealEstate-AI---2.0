'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

export function MapTutorial() {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Check if the user has seen the tutorial before
    const hasSeenTutorial = localStorage.getItem('hasSeenMapTutorial');
    if (!hasSeenTutorial) {
      setIsOpen(true);
      localStorage.setItem('hasSeenMapTutorial', 'true');
    }
  }, []);

  const steps = [
    {
      title: 'Welcome to the Real Estate Map',
      content: 'Explore and discover the best real estate deals on our interactive map.',
    },
    {
      title: 'Filter Properties',
      content: 'Use the filters panel to narrow down properties by price, cap rate, and risk level.',
    },
    {
      title: 'Property Clusters',
      content: 'Zoom in to see individual properties or view clusters that group nearby properties.',
    },
    {
      title: 'Legend',
      content: 'Check the legend in the bottom right to understand the different property markers.',
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const currentContent = steps[currentStep];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
    }
  };

  const skipTutorial = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{currentContent.title}</DialogTitle>
          <DialogDescription>
            {currentContent.content}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between items-center pt-4">
          <Button 
            variant="ghost" 
            onClick={skipTutorial}
            className="text-muted-foreground"
          >
            Skip
          </Button>
          
          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-primary' : 'bg-muted'}`}
              />
            ))}
          </div>
          
          <Button onClick={nextStep}>
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
