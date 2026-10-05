import { forwardRef, type TextareaHTMLAttributes } from 'react';
import styles from './Textarea.module.scss';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, className, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={[styles.textarea, error ? styles.error : '', className ?? '']
            .filter(Boolean)
            .join(' ')}
          aria-invalid={!!error}
          {...props}
        />
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
