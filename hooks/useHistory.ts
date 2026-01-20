import { useState, useCallback, useRef } from 'react';

interface UseHistoryReturn<T> {
  state: T;
  setState: (newState: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
}

const MAX_HISTORY_SIZE = 50;

export function useHistory<T>(initialState: T): UseHistoryReturn<T> {
  const [state, setStateInternal] = useState<T>(initialState);
  const historyRef = useRef<T[]>([initialState]);
  const currentIndexRef = useRef(0);
  const isUndoRedoRef = useRef(false);

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    setStateInternal(prev => {
      const nextState = typeof newState === 'function'
        ? (newState as (prev: T) => T)(prev)
        : newState;

      // Undo/Redo 중에는 히스토리에 추가하지 않음
      if (!isUndoRedoRef.current) {
        // 현재 위치 이후의 히스토리 삭제 (새로운 분기 생성)
        historyRef.current = historyRef.current.slice(0, currentIndexRef.current + 1);

        // 새 상태 추가
        historyRef.current.push(nextState);

        // 히스토리 크기 제한
        if (historyRef.current.length > MAX_HISTORY_SIZE) {
          historyRef.current.shift();
        } else {
          currentIndexRef.current++;
        }
      }

      return nextState;
    });
  }, []);

  const undo = useCallback(() => {
    if (currentIndexRef.current > 0) {
      isUndoRedoRef.current = true;
      currentIndexRef.current--;
      setStateInternal(historyRef.current[currentIndexRef.current]);
      // 다음 렌더링 후 플래그 리셋
      setTimeout(() => {
        isUndoRedoRef.current = false;
      }, 0);
    }
  }, []);

  const redo = useCallback(() => {
    if (currentIndexRef.current < historyRef.current.length - 1) {
      isUndoRedoRef.current = true;
      currentIndexRef.current++;
      setStateInternal(historyRef.current[currentIndexRef.current]);
      // 다음 렌더링 후 플래그 리셋
      setTimeout(() => {
        isUndoRedoRef.current = false;
      }, 0);
    }
  }, []);

  const clear = useCallback(() => {
    historyRef.current = [state];
    currentIndexRef.current = 0;
  }, [state]);

  return {
    state,
    setState,
    undo,
    redo,
    canUndo: currentIndexRef.current > 0,
    canRedo: currentIndexRef.current < historyRef.current.length - 1,
    clear,
  };
}
