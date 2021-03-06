import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import {
  Container,
  Content,
  Background,
  AnimationContainer,
} from './SignIn.styles';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/AuthContext';
import { useToast } from '../../hooks/ToastContext';

import logo from '../../assets/logo.svg';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const { signIn } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email required')
            .email('Email invalid.'),
          password: Yup.string().required('mandatory password'),
        });

        await schema.validate(data, { abortEarly: false });
        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(err));
        } else {
          addToast({
            title: 'Authentication error',
            description:
              'There was an error logging in, check the credentials.',
            type: 'error',
          });
        }
      }
    },
    [signIn, addToast, history],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="Go Barber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Login</h1>
            <Input icon={FiMail} name="email" placeholder="E-mail" />
            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="password"
            />
            <Button type="submit">Enter</Button>
            <Link to="/forgot-password">Forgot Password</Link>
          </Form>

          <Link to="/sign-up">
            <FiLogIn />
            Sign Up
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
