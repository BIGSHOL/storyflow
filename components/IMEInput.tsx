import React, { useState, useRef, useCallback, useEffect } from 'react';

interface IMEInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

interface IMETextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

/**
 * IME 입력(한글 등)을 올바르게 처리하는 Input 컴포넌트
 * 조합 중에는 로컬 상태만 업데이트하고, 조합 완료 시 부모에게 전달
 */
export const IMEInput: React.FC<IMEInputProps> = ({ value, onChange, ...props }) => {
  const [localValue, setLocalValue] = useState(value);
  const isComposingRef = useRef(false);

  // 외부 value가 변경되면 로컬 값 동기화 (조합 중이 아닐 때만)
  useEffect(() => {
    if (!isComposingRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // 조합 중이 아닐 때만 부모에게 전달
    if (!isComposingRef.current) {
      onChange(newValue);
    }
  }, [onChange]);

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    // 조합 완료 시 최종 값 전달
    onChange(e.currentTarget.value);
  }, [onChange]);

  return (
    <input
      {...props}
      value={localValue}
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
    />
  );
};

/**
 * IME 입력(한글 등)을 올바르게 처리하는 Textarea 컴포넌트
 */
export const IMETextarea: React.FC<IMETextareaProps> = ({ value, onChange, ...props }) => {
  const [localValue, setLocalValue] = useState(value);
  const isComposingRef = useRef(false);

  useEffect(() => {
    if (!isComposingRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (!isComposingRef.current) {
      onChange(newValue);
    }
  }, [onChange]);

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLTextAreaElement>) => {
    isComposingRef.current = false;
    onChange(e.currentTarget.value);
  }, [onChange]);

  return (
    <textarea
      {...props}
      value={localValue}
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
    />
  );
};

export default IMEInput;
