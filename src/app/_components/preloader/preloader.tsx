'use client';

import React, { useReducer, useEffect, useRef, useCallback } from 'react';
import styles from './preloader.module.css';

type Stage =
  | 'TYPING_NAME'
  | 'TOOL_INIT'
  | 'TYPING_COMMAND'
  | 'WAITING'
  | 'LOADING';

interface State {
  stage: Stage;
  typedName: string;
  typedCommand: string;
  initStep: number;
}

type Action =
  | { type: 'SET_TYPED_NAME'; name: string }
  | { type: 'START_INIT' }
  | { type: 'ADVANCE_INIT' }
  | { type: 'SET_TYPED_COMMAND'; command: string }
  | { type: 'START_LOADING' };

const INIT_NAME = 'unicorn';
const PLAN_COMMAND = 'Build a Unicorn';

const INIT_MESSAGES = [
  '> Initializing...',
  '> Loading models...',
  '> Connecting to unicorn stables...',
  '> Ready.',
];

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TYPED_NAME':
      return { ...state, typedName: action.name };
    case 'START_INIT':
      return { ...state, stage: 'TOOL_INIT', initStep: 0 };
    case 'ADVANCE_INIT':
      const nextStep = state.initStep + 1;
      if (nextStep >= INIT_MESSAGES.length) {
        return { ...state, initStep: nextStep, stage: 'TYPING_COMMAND' };
      }
      return { ...state, initStep: nextStep };
    case 'SET_TYPED_COMMAND':
      if (action.command.length === PLAN_COMMAND.length) {
        return { ...state, typedCommand: action.command, stage: 'WAITING' };
      }
      return { ...state, typedCommand: action.command };
    case 'START_LOADING':
      return { ...state, stage: 'LOADING' };
    default:
      return state;
  }
}

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [state, dispatch] = useReducer(reducer, {
    stage: 'TYPING_NAME',
    typedName: '',
    typedCommand: '',
    initStep: 0,
  });

  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-type "unicorn-mafia" on mount
  useEffect(() => {
    if (state.stage === 'TYPING_NAME' && state.typedName.length < INIT_NAME.length) {
      const timeout = setTimeout(() => {
        dispatch({
          type: 'SET_TYPED_NAME',
          name: INIT_NAME.slice(0, state.typedName.length + 1),
        });
      }, 80 + Math.random() * 40);

      return () => clearTimeout(timeout);
    } else if (state.stage === 'TYPING_NAME' && state.typedName.length === INIT_NAME.length) {
      // Finished typing name, start init after a brief pause
      const timeout = setTimeout(() => {
        dispatch({ type: 'START_INIT' });
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [state.stage, state.typedName]);

  // Tool initialization sequence
  useEffect(() => {
    if (state.stage === 'TOOL_INIT' && state.initStep < INIT_MESSAGES.length) {
      const timeout = setTimeout(() => {
        dispatch({ type: 'ADVANCE_INIT' });
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [state.stage, state.initStep]);

  // Typing animation for "Build a Unicorn" command
  useEffect(() => {
    if (state.stage === 'TYPING_COMMAND' && state.typedCommand.length < PLAN_COMMAND.length) {
      const timeout = setTimeout(() => {
        dispatch({
          type: 'SET_TYPED_COMMAND',
          command: PLAN_COMMAND.slice(0, state.typedCommand.length + 1),
        });
      }, 50 + Math.random() * 30);

      return () => clearTimeout(timeout);
    }
  }, [state.stage, state.typedCommand]);

  // Loading stage - delay then complete
  useEffect(() => {
    if (state.stage === 'LOADING') {
      const timeout = setTimeout(() => {
        onComplete();
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [state.stage, onComplete]);

  // Handle keyboard/click interaction - only for WAITING stage
  const handleInteraction = useCallback(() => {
    if (state.stage === 'WAITING') {
      dispatch({ type: 'START_LOADING' });
    }
  }, [state.stage]);

  // Global keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleInteraction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInteraction]);

  const getHintText = () => {
    if (state.stage === 'WAITING') {
      return (
        <>
          Press <span className={styles.hintKey}>Enter</span> or tap to execute
        </>
      );
    }
    return null;
  };

  const renderInitMessages = () => {
    const visibleMessages = INIT_MESSAGES.slice(0, state.initStep);

    return (
      <div>
        {visibleMessages.map((msg, i) => (
          <div
            key={i}
            className={styles.bootLine}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {msg}
          </div>
        ))}
      </div>
    );
  };

  const showInitMessages = state.stage !== 'TYPING_NAME';
  const showToolFrame =
    state.stage === 'TYPING_COMMAND' ||
    state.stage === 'WAITING' ||
    state.stage === 'LOADING';

  return (
    <div className={styles.preloaderContainer} onClick={handleInteraction}>
      <div
        ref={terminalRef}
        className={styles.terminal}
        tabIndex={0}
        role="application"
        aria-label="Interactive CLI preloader. Press Enter to interact."
      >
        <div className={styles.terminalHeader}>
          <div className={`${styles.trafficLight} ${styles.red}`} />
          <div className={`${styles.trafficLight} ${styles.yellow}`} />
          <div className={`${styles.trafficLight} ${styles.green}`} />
          <div className={styles.terminalTitle}>unicorn-mafia — zsh</div>
        </div>

        <div className={styles.terminalBody}>
          {/* Initial command line - typing unicorn-mafia */}
          <div className={styles.promptLine}>
            <span className={styles.prompt}>&gt;_</span>
            <span className={styles.command}>{state.typedName}</span>
            {state.stage === 'TYPING_NAME' && <span className={styles.cursor} />}
          </div>

          {/* Init messages */}
          {showInitMessages && (
            <div style={{ marginTop: '16px' }}>{renderInitMessages()}</div>
          )}

          {/* Tool frame */}
          {showToolFrame && (
            <div className={styles.claudeFrame}>
              <div className={styles.claudeHeader}>
                <span className={styles.claudeLogo}>◆</span>
                <span className={styles.claudeTitle}>unicorn-mafia</span>
              </div>
              <div className={styles.claudeBody}>
                {/* Typed command */}
                <div className={styles.promptLine}>
                  <span className={styles.prompt}>&gt;</span>
                  <span className={styles.command}>{state.typedCommand}</span>
                  {(state.stage === 'TYPING_COMMAND' || state.stage === 'WAITING') && (
                    <span className={styles.cursor} />
                  )}
                </div>

                {/* Loading indicator */}
                {state.stage === 'LOADING' && (
                  <div className={styles.loadingIndicator}>
                    <span className={styles.spinner} />
                    Building...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hint text */}
          {getHintText() && <div className={styles.hint}>{getHintText()}</div>}
        </div>
      </div>
    </div>
  );
}
