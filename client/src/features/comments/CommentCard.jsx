import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import { useDeleteCommentMutation } from './commentsApiSlice';

import useAuth from '../../hooks/useAuth';
import CommentForm from './CommentForm';

const CommentCard = ({ comment }) => {
	const [editing, setEditing] = useState(false);
	const { login, isAdmin } = useAuth();
	const [deleteComment] = useDeleteCommentMutation();

	const handleDelete = async () => {
		await deleteComment({ commentId: comment.id }).unwrap();
	};

	return (
		<Card
			size="small"
			type="inner"
			title={
				<Link to={`/users/${comment.author.login}`}>
					{comment.author.login}
				</Link>
			}
			extra={
				<Space direction="horizontal">
					<Typography.Text>
						{new Date(comment.publish_date).toLocaleString()}
					</Typography.Text>
					{(login === comment.author.login || isAdmin) && (
						<>
							<Button
								type="text"
								icon={<EditOutlined />}
								onClick={() => setEditing(!editing)}
							/>
							<Button
								type="text"
								icon={<DeleteOutlined />}
								danger
								onClick={handleDelete}
							/>
						</>
					)}
				</Space>
			}
		>
			{editing ? (
				<CommentForm
					isEditing={editing}
					content={comment.content}
					commentId={comment.id}
					setEiting={setEditing}
				/>
			) : (
				<Typography.Text>{comment.content}</Typography.Text>
			)}
		</Card>
	);
};

export default CommentCard;
