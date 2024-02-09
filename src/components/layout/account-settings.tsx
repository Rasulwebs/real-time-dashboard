import { SaveButton, useForm } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import { GetFields, GetVariables } from "@refinedev/nestjs-query";

import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, Form, Input, Spin } from "antd";

import { getNameInitials } from "@/utilities";
import { UPDATE_USER_MUTATION } from "@/graphql/mutations";

import { Text } from "../text";
import CustomAvatar from "../custom-avatar";

import {
  UpdateUserMutation,
  UpdateUserMutationVariables,
} from "@/graphql/types";

type Props = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  userId: string;
};

export const AccountSettings = ({ opened, setOpened, userId }: Props) => {
  const { saveButtonProps, formProps, queryResult } = useForm<
    GetFields<UpdateUserMutation>,
    // a type that represents an HTTP error. Used to specify the type of error mutation can throw.
    HttpError,
    GetVariables<UpdateUserMutationVariables>
  >({
    mutationMode: "optimistic",

    resource: "users",

    action: "edit",
    id: userId,

    meta: {
      // gqlMutation is used to specify the mutation that should be performed.
      gqlMutation: UPDATE_USER_MUTATION,
    },
  });
  const { avatarUrl, name } = queryResult?.data?.data || {};

  const closeModal = () => {
    setOpened(false);
  };

  // if query is processing, show a loading indicator
  if (queryResult?.isLoading) {
    return (
      <Drawer
        open={opened}
        width={756}
        styles={{
          body: {
            background: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Spin />
      </Drawer>
    );
  }

  return (
    <Drawer
      onClose={closeModal}
      open={opened}
      width={756}
      styles={{
        body: { background: "#f5f5f5", padding: 0 },
        header: { display: "none" },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          backgroundColor: "#fff",
        }}
      >
        <Text strong>Account Settings</Text>
        <Button
          type='text'
          icon={<CloseOutlined />}
          onClick={() => closeModal()}
        />
      </div>
      <div
        style={{
          padding: "16px",
        }}
      >
        <Card>
          <Form {...formProps} layout='vertical'>
            <CustomAvatar
              shape='square'
              src={avatarUrl}
              name={getNameInitials(name || "")}
              style={{
                width: 96,
                height: 96,
                marginBottom: "24px",
              }}
            />
            <Form.Item label='Name' name='name'>
              <Input placeholder='Name' />
            </Form.Item>
            <Form.Item label='Email' name='email'>
              <Input placeholder='email' />
            </Form.Item>
            <Form.Item label='Job title' name='jobTitle'>
              <Input placeholder='jobTitle' />
            </Form.Item>
            <Form.Item label='Phone' name='phone'>
              <Input placeholder='Timezone' />
            </Form.Item>
          </Form>
          <SaveButton
            {...saveButtonProps}
            style={{
              display: "block",
              marginLeft: "auto",
            }}
          />
        </Card>
      </div>
    </Drawer>
  );
};
