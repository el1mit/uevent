import { useState } from 'react';
import { Form, Button, Mentions, Alert } from 'antd';
import { useGetUsersQuery } from '../users/usersApiSlice';
import {
	useCreateCommentMutation,
	useEditCommentMutation,
} from './commentsApiSlice';

const CommentForm = ({ eventId, isEditing, content, commentId, setEiting }) => {
	const [createComment] = useCreateCommentMutation();
	const [editComment] = useEditCommentMutation();
	const [errMsg, setErrMsg] = useState('');

	const onFinish = async (values) => {
		try {
			if (isEditing) {
				await editComment({ commentId, content: values.comment }).unwrap();
				setEiting(false);
			} else {
				await createComment({ eventId, content: values.comment }).unwrap();
			}
		} catch (error) {
			setErrMsg(error.data.message);
		}
	};

	const { data: users, isSuccess } = useGetUsersQuery({ limit: 0 });

	return (
		<>
			<Form
				layout="horizontal"
				align="start"
				style={{ padding: '0 24px' }}
				onFinish={onFinish}
			>
				<Form.Item
					name="comment"
					initialValue={content}
					rules={[{ required: true }]}
				>
					<Mentions
						rows={3}
						placeholder="You can use @login to ref user here"
						options={
							isSuccess
								? [
										...Object.entries(users.entities).map(([key, value]) => ({
											value: value.login,
											label: value.login,
										})),
								  ]
								: [{ value: '', label: '' }]
						}
					/>
				</Form.Item>
				<Form.Item>
					<Button htmlType="submit" type="primary">
						{isEditing ? 'Edit comment' : 'Send comment'}
					</Button>
				</Form.Item>
			</Form>

			{errMsg ? (
				<Alert style={{ marginBottom: '20px' }} message={errMsg} type="error" />
			) : null}
		</>
	);
};

export default CommentForm;
