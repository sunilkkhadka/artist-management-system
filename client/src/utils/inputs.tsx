import { FormGroup, Label, Input, FormFeedback, Button } from "reactstrap";

import { FButtonProps, FInputProps, FSelectProps } from "../types/input.type";

export const FInput = (props: FInputProps) => {
  const { title, error, ...rest } = props;

  return (
    <FormGroup className="input-field">
      <Label for={title}>{title}</Label>
      <Input invalid={error ? true : false} autoComplete="off" {...rest} />
      {error && <FormFeedback invalid>{error}</FormFeedback>}
    </FormGroup>
  );
};

export const FButton = (props: FButtonProps) => {
  const { disabled, children, onClick } = props;
  return (
    <Button disabled={disabled} type="button" color="primary" onClick={onClick}>
      {children}
    </Button>
  );
};

export const FSelect = (props: FSelectProps) => {
  const { data, title, name, value, handleChange } = props;

  return (
    <FormGroup>
      <Label className="select-label" for={title}>
        {title}
      </Label>
      <select name={name} value={value} onChange={handleChange}>
        <option value="">--Please choose an option--</option>
        {data?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormGroup>
  );
};
