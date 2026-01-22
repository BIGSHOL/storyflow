import React, { useState, useEffect, useCallback } from 'react';

interface KoreanInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  type?: 'text' | 'textarea';
  rows?: number;
}

/**
 * 한글 IME 입력을 위한 컴포넌트
 * 로컬 상태를 사용하여 입력 중 리렌더링으로 인한 자모 분리 문제 방지
 * onBlur 시에만 상위 상태 업데이트
 */
const KoreanInput: React.FC<KoreanInputProps> = ({
  value,
  onChange,
  className = '',
  placeholder = '',
  type = 'text',
  rows = 4,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // 외부 value가 변경되고 포커스가 없을 때만 로컬 값 동기화
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value);
    }
  }, [value, isFocused]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  }, [localValue, value, onChange]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  if (type === 'textarea') {
    return (
      <textarea
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={className}
        placeholder={placeholder}
        rows={rows}
      />
    );
  }

  return (
    <input
      type="text"
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      className={className}
      placeholder={placeholder}
    />
  );
};

export default KoreanInput;
