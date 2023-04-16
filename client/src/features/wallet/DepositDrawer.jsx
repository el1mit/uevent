import { useState } from 'react';
import { Button, Drawer, Form, Input, InputNumber, Alert } from 'antd';
import { useDepositWalletMutation } from './walletApiSlice';

const DepositDrawer = ({ open, setOpen }) => {
	const [depositWallet] = useDepositWalletMutation();
	const [errMsg, setErrMsg] = useState('');

	const handleSubmit = async (values) => {
		try {
			values.number_card = values.number_card.replaceAll(' ', '');
			await depositWallet(values).unwrap();
			setOpen(false);
		} catch (error) {
			setErrMsg(error.data.message);
		}
	};

	return (
		<>
			<Drawer
				title="Deposit Funds"
				width="25vw"
				onClose={() => setOpen(false)}
				open={open}
			>
				{errMsg ? (
					<Alert
						style={{ marginBottom: '20px' }}
						message={errMsg}
						type="error"
					/>
				) : null}

				<Form onFinish={handleSubmit}>
					<Form.Item
						name="number_card"
						label="Card Number"
						rules={[
							{
								required: true,
								message: 'Please enter your card number',
							},
							{
								len: 19,
								message: 'Lenght of card number must be 19',
							},
							{
								pattern: /^([0-9]{4}\s){3}[0-9]{4}$/,
								message: 'Please enter a valid card number',
							},
						]}
					>
						<Input placeholder="XXXX XXXX XXXX XXXX" />
					</Form.Item>

					<Form.Item
						name="cvv"
						label="CVV Code"
						rules={[
							{
								required: true,
								message: 'Please enter your CVV code',
							},
							{
								len: 3,
								message: 'Lenght of CVV code must be 3',
							},
							{
								pattern: /^[0-9]{3}$/,
								message: 'Please enter a valid CVV code',
							},
						]}
					>
						<Input placeholder="XXX" />
					</Form.Item>

					<Form.Item
						name="expires_end"
						label="Expiration Date"
						rules={[
							{
								required: true,
								message: 'Please enter your card expiration date',
							},
							{
								pattern: /^(0[1-9]|1[0-2])\/\d{2}$/,
								message: 'Please enter a valid expiration date',
							},
						]}
					>
						<Input placeholder="MM/YY" />
					</Form.Item>

					<Form.Item
						name="amount"
						label="Amount"
						rules={[
							{
								required: true,
								message: 'Please enter an amount',
							},
						]}
					>
						<InputNumber min={10} step={100} addonAfter="UAH" />
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit">
							Deposit
						</Button>
					</Form.Item>
				</Form>
			</Drawer>
		</>
	);
};
export default DepositDrawer;
