import { useState } from 'react';
import { Button, Drawer, Form, Input, InputNumber, Alert } from 'antd';
import { useWithdrawWalletMutation } from './walletApiSlice';

const WithdrawDrawer = ({ open, setOpen }) => {
	const [withdrawWallet] = useWithdrawWalletMutation();
	const [errMsg, setErrMsg] = useState('');

	const handleSubmit = async (values) => {
		try {
			values.number_card = values.number_card.replaceAll(' ', '');
			await withdrawWallet(values).unwrap();
			setOpen(false);
		} catch (error) {
			setErrMsg(error.data.message);
		}
	};

	return (
		<>
			<Drawer
				title="Withdraw Funds"
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
							Withdraw
						</Button>
					</Form.Item>
				</Form>
			</Drawer>
		</>
	);
};
export default WithdrawDrawer;
