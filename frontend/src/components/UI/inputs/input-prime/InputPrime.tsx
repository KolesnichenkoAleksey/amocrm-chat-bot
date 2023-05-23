import React from 'react';
import classNameCheck from '../../../../helpers/classNameCheck';
import cl from './inputPrime.module.scss';

interface Props {
    clName?: string,
    placeholder?: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    type: 'text' | 'email' | 'password' | 'tel',
}

const InputPrime = ({ clName, placeholder, value, onChange, type }: Props) => {
	return (
		<input
			className={classNameCheck(clName, cl.input)}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			type={type}
		/>
    )
}

export default InputPrime
