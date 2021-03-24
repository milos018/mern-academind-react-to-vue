import React, { useState, useContext, Fragment } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import {
	VALIDATOR_EMAIL,
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from '../../shared/utils/validator';

import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './Auth.css';

const Auth = () => {
	const auth = useContext(AuthContext);
	const [isLoginMode, setIsLoginMode] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const [formState, inputHandler, setFormData] = useForm(
		{
			email: {
				value: '',
				isValid: false,
			},
			password: {
				value: '',
				isValid: false,
			},
		},
		false,
	);

	const switchModeHandler = () => {
		if (!isLoginMode) {
			setFormData(
				{
					...formState.inputs,
					name: undefined,
				},
				formState.inputs.email.isValid && formState.inputs.password.isValid,
			);
		} else {
			setFormData(
				{
					...formState.inputs,
					name: '',
					isValid: false,
				},
				false,
			);
		}
		setIsLoginMode((prevMode) => !prevMode);
	};

	const authSubmitHandler = async (event) => {
		event.preventDefault();

		setIsLoading(true);

		if (isLoginMode) {
			try {
				const url = 'http://localhost:5500/api/users/login';
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
				});

				const responseData = await response.json();
				if (!response.ok) {
					throw new Error(responseData.message);
				}

				setIsLoading(false);
				auth.login();
			} catch (error) {
				setIsLoading(false);
				setError(error.message || 'Something went wrong, please try again');
			}
		} else {
			const url = 'http://localhost:5500/api/users/signup';
			try {
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: formState.inputs.name.value,
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
				});

				const responseData = await response.json();
				if (!response.ok) {
					throw new Error(responseData.message);
				}

				setIsLoading(false);
				auth.login();
			} catch (error) {
				setIsLoading(false);
				setError(error.message || 'Something went wrong, please try again');
			}
		}
	};

	const errorHandler = () => {
		setError(null);
	};

	return (
		<Fragment>
			<ErrorModal error={error} onClear={errorHandler} />
			<Card className='authentication'>
				{isLoading && <LoadingSpinner asOverlay />}
				<h2>Login Required</h2>
				<hr />
				<form onSubmit={authSubmitHandler}>
					{!isLoginMode && (
						<Input
							id='name'
							element='input'
							type='text'
							label='Your Name'
							validators={[VALIDATOR_REQUIRE()]}
							errorText='Pleae enter a name.'
							onInput={inputHandler}
						/>
					)}
					<Input
						id='email'
						element='input'
						type='email'
						label='Email'
						validators={[VALIDATOR_EMAIL()]}
						errorText='Pleae enter a valid email'
						onInput={inputHandler}
					/>
					<Input
						id='password'
						element='input'
						type='password'
						label='Password'
						validators={[VALIDATOR_MINLENGTH(6)]}
						errorText='Pleae enter a password with at least 6 characters.'
						onInput={inputHandler}
					/>
					<Button type='submit' disabled={!formState.isValid}>
						{isLoginMode ? 'Login' : 'Signup'}
					</Button>
					<Button type='button' inverse onClick={switchModeHandler}>
						Switch to {isLoginMode ? 'Signup' : 'Login'}
					</Button>
				</form>
			</Card>
		</Fragment>
	);
};

export default Auth;
