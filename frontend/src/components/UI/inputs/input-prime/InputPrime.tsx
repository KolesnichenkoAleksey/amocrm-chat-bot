import classNames from 'classnames';
import React from 'react';
import cl from './inputPrime.module.scss';

interface Props {
    clName?: string,
    placeholder?: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    type: 'text' | 'email' | 'password' | 'tel',
}

const InputPrime = ({ clName, placeholder, value, onChange, type }: Props): JSX.Element => {
	return (
		<input
			className={classNames(clName, cl.input)}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			type={type}
		/>
    )
}

export default InputPrime
