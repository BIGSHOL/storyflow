import React, { useState, useEffect, useCallback, useRef } from 'react';

interface KoreanInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'textarea';
  rows?: number;
}

/**
 * 한글 IME 입력을 위한 컴포넌트
 * onCompositionStart/End 이벤트를 사용하여 조합 중에는 로컬 상태만 업데이트
 * 조합 완료 후 상위 상태 업데이트 (실시간 반영)
 */
const KoreanInput: React.FC<KoreanInputProps> = ({
  value,
  onChange,
  className = '',
  placeholder = '',
  type = 'text',
  rows = 4,
  ...restProps
}) => {
  const [localValue, setLocalValue] = useState(value);
  const isComposingRef = useRef(false);

  // 외부 value가 변경되면 로컬 값 동기화 (조합 중이 아닐 때만)
  useEffect(() => {
    if (!isComposingRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // 조합 중이 아닐 때만 부모에게 전달 (영문, 숫자 등은 즉시 반영)
    if (!isComposingRef.current) {
      onChange(newValue);
    }
  }, [onChange]);

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    isComposingRef.current = false;
    // 조합 완료 시 최종 값 전달
    onChange(e.currentTarget.value);
  }, [onChange]);

  if (type === 'textarea') {
    return (
      <textarea
        value={localValue}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        className={className}
        placeholder={placeholder}
        rows={rows}
        {...(restProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    );
  }

  return (
    <input
      type="text"
      value={localValue}
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      className={className}
      placeholder={placeholder}
      {...restProps}
    />
  );
};

export default KoreanInput;
