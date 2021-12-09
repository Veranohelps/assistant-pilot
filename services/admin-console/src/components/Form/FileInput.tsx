import { useField } from 'formik';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Input = styled.input`
  width: min-content;
`

interface IProps extends React.InputHTMLAttributes<any> {
  name: string;
}

const FileInput = (props: IProps) => {
  const [input, meta, helpers] = useField(props.name);
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!meta.value && ref.current) {
      ref.current.value = '';
    }
  }, [meta.value]);

  return (
    <Input
      {...props}
      onBlur={input.onBlur}
      name={props.name}
      ref={ref}
      type="file"
      onChange={(e) => {
        const file = e.target.files?.[0] ?? null;

        helpers.setValue(file);
      }}
    />
  );
};

export default FileInput;
