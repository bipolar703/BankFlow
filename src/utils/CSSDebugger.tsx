import { useState, useEffect } from 'react';

/**
 * Enhanced CSS Debugger Component
 * 
 * This utility helps identify CSS issues by showing which classes are causing problems
 * and providing useful information about the CSS in your application.
 * 
 * Features:
 * - Captures and logs CSS-related errors
 * - Identifies problematic Tailwind classes
 * - Suggests potential fixes for common issues
 * - Can trace opacity variant errors specifically
 * 
 * Usage:
 * - Import this component at the top level of your application during development
 * - It will automatically track CSS errors and log helpful information
 * - Can be disabled in production by setting the enabled prop to false
 */
const CSSDebugger = ({ enabled = true }: { enabled?: boolean }) => {
  const [cssErrors, setCssErrors] = useState<Array<{ message: string; timestamp: Date }>>([]);

  useEffect(() => {
    if (!enabled) return;

    // CSS error observer
    const originalConsoleError = console.error;
    
    // Override console.error to catch CSS-related issues
    console.error = (...args) => {
      const errorMessage = args.join(' ');
      
      // Check if this is a CSS-related error
      if (
        (typeof errorMessage === 'string' && 
          (errorMessage.includes('[tailwind]') || 
           errorMessage.includes('[postcss]') || 
           errorMessage.includes('class does not exist') ||
           errorMessage.includes('@apply')))
      ) {
        setCssErrors(prev => [
          ...prev, 
          { message: errorMessage, timestamp: new Date() }
        ]);
      }
      
      // Call the original console.error
      originalConsoleError.apply(console, args);
    };

    // Log helpful information
    console.info(
      '%c🔍 Enhanced CSS Debugger Activated',
      'background: #134e4a; color: white; padding: 2px 4px; border-radius: 2px;',
      '\nTracking CSS issues, Tailwind conflicts, and opacity modifier problems.'
    );

    // Cleanup
    return () => {
      console.error = originalConsoleError;
    };
  }, [enabled]);

  // Log any new errors as they come in
  useEffect(() => {
    if (!enabled || cssErrors.length === 0) return;
    
    const latestError = cssErrors[cssErrors.length - 1];
    
    console.group(
      '%c🐞 CSS Issue Detected',
      'background: #FEF2F2; color: #991B1B; padding: 2px 4px; border-radius: 2px;'
    );
    console.info(`Time: ${latestError.timestamp.toLocaleTimeString()}`);
    console.info(`Error: ${latestError.message}`);
    
    // Extract class name if possible
    const classMatch = latestError.message.match(/The `([^`]+)` class does not exist/);
    if (classMatch && classMatch[1]) {
      console.warn(
        `The problem class appears to be: %c${classMatch[1]}`, 
        'font-weight: bold; color: #991B1B;'
      );
      
      // Provide specific guidance for opacity modifiers
      if (classMatch[1].includes('/')) {
        console.info(
          '%c💡 Opacity Modifier Issue Detected',
          'background: #FFFBEB; color: #92400E; padding: 2px 4px; border-radius: 2px;'
        );
        console.info(
          'This appears to be an opacity modifier issue. Make sure your tailwind.config.js properly supports opacity variants for custom colors.'
        );
        console.info(
          'Suggested fix: Add the color with proper opacity configuration in your tailwind.config.js theme extensions.'
        );
      } else {
        console.info(
          'Suggestion: Check that this class is properly defined in your tailwind.config.js or that you\'re using the correct Tailwind syntax.'
        );
      }
    }
    
    // Check for @apply issues
    if (latestError.message.includes('@apply')) {
      console.info(
        '%c💡 @apply Directive Issue',
        'background: #FFFBEB; color: #92400E; padding: 2px 4px; border-radius: 2px;'
      );
      console.info(
        'This is an issue with the @apply directive. Make sure all classes used with @apply are basic utility classes or properly defined in your config.'
      );
    }
    
    console.groupEnd();
  }, [cssErrors, enabled]);

  // This component doesn't render anything
  return null;
};

export default CSSDebugger;
