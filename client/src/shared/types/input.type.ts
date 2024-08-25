import { ButtonProps, InputProps } from "reactstrap";

export interface FInputProps extends InputProps {
  title: string;
}

export interface FButtonProps extends ButtonProps {
  loading?: boolean;
  disabled: boolean;
  icon?: React.ReactNode;
  styles?: Record<string, string>;
  className?: string;
}

export interface FSelectProps extends InputProps {
  name: string;
  title: string;
  data: {
    label: string;
    value: string;
  }[];
}
