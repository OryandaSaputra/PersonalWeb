export type LoginFieldErrors = {
  email?: string;
  password?: string;
};

export type LoginActionState = {
  formError?: string;
  fieldErrors?: LoginFieldErrors;
  values: {
    email: string;
  };
};

export const initialLoginActionState: LoginActionState = {
  values: {
    email: "",
  },
};
