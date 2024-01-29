import { CalendarOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React, { useState } from 'react';
import { Text } from '../text';

const UpComingEvents = () => {
    const [loading, setLoading] = useState(true);


    return (
        <Card style={{ height: "100%" }}
            headStyle={{ padding: "8px 16px" }}
            bodyStyle={{ padding: "0 1rem" }}
            title={
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    <CalendarOutlined />
                    <Text size='sm' style={{ marginLeft: "0.7rem" }}>Upcoming Events</Text>
                </div>
            }>

            UpComingEvents
        </Card>
    );
};

export default UpComingEvents;