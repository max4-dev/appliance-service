import { useCreateComment } from "@/entities/comment/model/hooks/useCreateComment";
import { useGetComments } from "@/entities/comment/model/hooks/useGetComments";
import { CreateCommentDto } from "@/entities/comment/model/types/comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, Button, Divider, Empty, Form, Input, List, message, Spin } from "antd";
import { FC } from "react";

interface Props {
  requestId: number;
  userId: string;
  userName: string;
  userRole: string;
}

export const CommentsSection: FC<Props> = ({
  requestId,
  userRole,
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useGetComments(requestId);
  

  const createCommentMutation = useCreateComment();

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => commentQuery.deleteComment(requestId, commentId),
    onSuccess: () => {
      message.success("Комментарий удален");
      queryClient.invalidateQueries({ queryKey: ["comments", requestId] });
    },
    onError: () => {
      message.error("Не удалось удалить комментарий");
    }
  });

  const onSubmitComment = (values: CreateCommentDto) => {
    createCommentMutation.mutate(
      { requestId, message: values.message },
      {
        onSuccess: () => {
          form.resetFields();
        },
      }
    );
  };

  const canDeleteComment = ["ADMIN", "SPECIALIST"].includes(userRole);
  const canCreateComment = ["SPECIALIST", "MANAGER", "ADMIN"].includes(userRole);


  if (isLoading) {
    return <Spin />;
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Комментарии</h3>
      <Divider />

      {comments.length === 0 ? (
        <Empty description="Нет комментариев" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div style={{ marginBottom: 24 }}>
          <List
            dataSource={comments as Comment[]}
            itemLayout="horizontal"
            renderItem={(comment) => (
              <List.Item
                actions={
                  canDeleteComment
                    ? [
                        <Button
                          key="delete"
                          type="text"
                          danger
                          size="small"
                          onClick={() => deleteCommentMutation.mutate(comment.id)}
                          loading={deleteCommentMutation.isPending}
                        >
                          Удалить
                        </Button>,
                      ]
                    : []
                }
              >
                <List.Item.Meta
                  // avatar={
                  //   <Avatar icon={< />} style={{ backgroundColor: '#87d068' }}>
                  //     {(comment.master?.name?.[0] || "?").toUpperCase()}
                  //   </Avatar>
                  // }
                  title={
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>{comment.master?.name || "Неизвестный"}</span>
                      <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
                        {new Date(comment.createdAt).toLocaleString("ru-RU")}
                      </span>
                    </div>
                  }
                  description={
                    <div style={{ color: "rgba(0, 0, 0, 0.88)" }}>
                      {comment.message}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )}

      {canCreateComment && (
        <div style={{ marginTop: 20 }}>
          <h4>Добавить комментарий</h4>
          <Form 
            form={form} 
            onFinish={onSubmitComment} 
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="message"
              rules={[{ required: true, message: "Введите текст комментария" }]}
            >
              <Input.TextArea 
                placeholder="Введите ваш комментарий..." 
                rows={3} 
                maxLength={500}
                showCount
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={createCommentMutation.isPending}
              >
                Отправить
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};
