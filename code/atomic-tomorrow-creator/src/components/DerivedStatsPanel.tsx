import React from 'react';
import { Zap, Info } from 'lucide-react';

// Style definitions for CRT effects
const crtStyles = {
  scanline: {
    background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
    backgroundSize: '100% 4px',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1,
    animation: 'scanlines 1s linear infinite'
  } as React.CSSProperties
};

interface DerivedStatsPanelProps {
  character: any;
  modifiedAttributes: Record<string, number>;
}

const DerivedStatsPanel: React.FC<DerivedStatsPanelProps> = ({
  character,
  modifiedAttributes
}) => {
  return (
    <>
      {/* Derived Statistics */}
      <div className="mt-8 bg-gray-800 p-6 rounded-xl border border-purple-900 relative overflow-hidden"
           style={{ boxShadow: '0 0 15px rgba(88, 28, 135, 0.5), inset 0 0 10px rgba(88, 28, 135, 0.3)' }}>
        <div style={crtStyles.scanline}></div>
        
        <h3 className="text-lg font-bold mb-4 text-purple-400 terminal-text relative z-10">
          DERIVED STATISTICS
        </h3>
        
        <div className="grid grid-cols-3 gap-6 relative z-10">
          <div className="bg-gray-900 p-4 rounded-lg relative"
               style={{ 
                 boxShadow: '0 0 10px rgba(37, 99, 235, 0.6), inset 0 0 8px rgba(37, 99, 235, 0.3)',
                 border: '1px solid rgba(37, 99, 235, 0.5)'
               }}>
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                 style={{ boxShadow: '0 0 8px rgba(37, 99, 235, 0.8)' }}>
              <Zap size={16} className="text-white" />
            </div>
            <div className="text-sm text-gray-400">Initiative</div>
            <div className="text-2xl font-bold text-blue-400"
                 style={{ textShadow: '0 0 8px rgba(96, 165, 250, 0.9)' }}>
              {modifiedAttributes.REFLEX ? modifiedAttributes.REFLEX * 5 : '??'}%
            </div>
            <div className="text-xs mt-1 text-gray-500">REFLEX × 5</div>
          </div>
          
          <div className="bg-gray-900 p-4 rounded-lg relative"
               style={{ 
                 boxShadow: '0 0 10px rgba(22, 163, 74, 0.6), inset 0 0 8px rgba(22, 163, 74, 0.3)',
                 border: '1px solid rgba(22, 163, 74, 0.5)'
               }}>
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center"
                 style={{ boxShadow: '0 0 8px rgba(22, 163, 74, 0.8)' }}>
              <Zap size={16} className="text-white" />
            </div>
            <div className="text-sm text-gray-400">Solar Scouts Training</div>
            <div className="text-2xl font-bold text-green-400"
                 style={{ textShadow: '0 0 8px rgba(74, 222, 128, 0.9)' }}>
              35%
            </div>
            <div className="text-xs mt-1 text-gray-500">Flat Skill %</div>
          </div>
          
          <div className="bg-gray-900 p-4 rounded-lg relative"
               style={{ 
                 boxShadow: '0 0 10px rgba(126, 34, 206, 0.6), inset 0 0 8px rgba(126, 34, 206, 0.3)',
                 border: '1px solid rgba(126, 34, 206, 0.5)'
               }}>
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center"
                 style={{ boxShadow: '0 0 8px rgba(126, 34, 206, 0.8)' }}>
              <Zap size={16} className="text-white" />
            </div>
            <div className="text-sm text-gray-400">Damage Soak</div>
            <div className="text-2xl font-bold text-purple-400"
                 style={{ textShadow: '0 0 8px rgba(192, 132, 252, 0.9)' }}>
              {modifiedAttributes.GRIT ? modifiedAttributes.GRIT * 5 : '??'}%
            </div>
            <div className="text-xs mt-1 text-gray-500">GRIT × 5</div>
          </div>
        </div>
      </div>
      
      {/* Origin Attributes Info */}
      <div className="mt-6 bg-gray-800 p-4 rounded-lg border border-yellow-900 relative overflow-hidden"
           style={{ boxShadow: '0 0 15px rgba(161, 98, 7, 0.4), inset 0 0 10px rgba(161, 98, 7, 0.2)' }}>
        <div style={crtStyles.scanline}></div>
        
        <div className="flex relative z-10">
          <Info size={20} className="text-yellow-400 mr-2 flex-shrink-0 mt-0.5" 
                style={{ filter: 'drop-shadow(0 0 5px rgba(250, 204, 21, 0.8))' }} />
          <div>
            <h4 className="font-bold text-yellow-400 terminal-text">
              ORIGIN ATTRIBUTE MODIFIERS: {character.origin?.name.toUpperCase() || "UNKNOWN"}
            </h4>
            <p className="text-sm text-yellow-300" style={{ textShadow: '0 0 5px rgba(253, 224, 71, 0.7)' }}>
              {character.origin?.attributeMods || "Select an origin to see attribute modifiers"}
            </p>
            <p className="text-xs mt-2 text-yellow-200" style={{ textShadow: '0 0 5px rgba(254, 240, 138, 0.7)' }}>
              These modifiers are automatically applied after you assign your base attributes.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DerivedStatsPanel;