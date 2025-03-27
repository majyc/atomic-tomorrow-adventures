import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Lock, Unlock, Database } from 'lucide-react';

const AccessPanel = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="access-panel-container mb-2">
      {/* Control Panel Header */}
      <div 
        className={`access-panel-control ${isOpen ? 'active' : ''}`}
        onClick={togglePanel}
        role="button"
        aria-expanded={isOpen}
        tabIndex={0}
      >
        <div className="warning-stripes"></div>
        
        <div className="panel-header-content">
          <div className="flex items-center">
            {isOpen ? <Unlock size={16} className="mr-2" /> : <Lock size={16} className="mr-2" />}
            <span className="font-bold">{title || "ACCESS PANEL"}</span>
          </div>
          
          <div className="flex items-center">
            <div className={`indicator-light ${isOpen ? 'active' : ''}`}>
              <div className="inner-light"></div>
            </div>
            <span className="status-text">{isOpen ? 'OPEN' : 'CLOSED'}</span>
            <div className="ml-2">
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>
        </div>
      </div>
      
      {/* Panel Content */}
      <div 
        className={`access-panel-content ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
      >
        <div className="panel-interior">
          <div className="flex items-center mb-2 text-yellow-400">
            <AlertTriangle size={16} className="mr-2" />
            <span className="text-xs">AUTHORIZED PERSONNEL ONLY</span>
          </div>
          
          <div className="panel-content-wrapper">
            {children}
          </div>
        </div>
      </div>
      
      {/* CSS */}
      <style jsx>{`
        .access-panel-container {
          position: relative;
        }
        
        .access-panel-control {
          position: relative;
          overflow: hidden;
          background-color: #1a1a1a;
          border: 2px solid #333333;
          border-radius: 4px;
          display: flex;
          align-items: center;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
          user-select: none;
        }
        
        .access-panel-control:hover {
          border-color: #3b82f6;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        
        .access-panel-control.active {
          border-color: #f59e0b;
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.6);
        }
        
        .warning-stripes {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 10px;
          background: repeating-linear-gradient(
            45deg,
            #f59e0b,
            #f59e0b 10px,
            #1f1f1f 10px,
            #1f1f1f 20px
          );
        }
        
        .panel-header-content {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px 8px 20px;
          color: #d4d4d8;
        }
        
        .indicator-light {
          width: 16px;
          height: 16px;
          background-color: #27272a;
          border-radius: 50%;
          margin-right: 8px;
          padding: 2px;
          border: 1px solid #52525b;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .inner-light {
          position: absolute;
          top: 3px;
          left: 3px;
          right: 3px;
          bottom: 3px;
          border-radius: 50%;
          background-color: #dc2626;
          opacity: 0.3;
        }
        
        .indicator-light.active {
          border-color: #65a30d;
          box-shadow: 0 0 10px rgba(101, 163, 13, 0.5);
        }
        
        .indicator-light.active .inner-light {
          background-color: #84cc16;
          opacity: 1;
          animation: pulse 2s infinite;
        }
        
        .status-text {
          font-size: 12px;
          margin-right: 8px;
          font-family: monospace;
        }
        
        .access-panel-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s ease;
        }
        
        .access-panel-content.open {
          max-height: 600px; /* Adjust based on expected maximum height */
        }
        
        .panel-interior {
          margin-top: 1px;
          padding: 12px;
          background-color: rgba(0, 0, 0, 0.5);
          border: 1px solid #52525b;
          border-top: none;
          border-radius: 0 0 4px 4px;
        }
        
        .panel-content-wrapper {
          background-color: rgba(15, 23, 42, 0.7);
          padding: 10px;
          border-radius: 3px;
          max-height: 500px;
          overflow-y: auto;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(132, 204, 22, 0.7);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(132, 204, 22, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(132, 204, 22, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default AccessPanel;