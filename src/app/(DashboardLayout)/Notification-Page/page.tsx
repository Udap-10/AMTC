"use client";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

// Sample notifications with different types (farmer added, animal detections)
const notifications = [
  {
    id: 1,
    message: "A new farmer has been added to the system.",
    time: "5 minutes ago",
    isRead: true,
    type: "farmer",
  },
  {
    id: 2,
    message: "Most detected animal: Elephant in the north field.",
    time: "1 hour ago",
    isRead: true,
    type: "animal",
  },
  {
    id: 3,
    message: "Camera maintenance scheduled for tomorrow.",
    time: "2 hours ago",
    isRead: true,
    type: "system",
  },
  {
    id: 4,
    message: "New update available for your system.",
    time: "3 hours ago",
    isRead: true,
    type: "system",
  },
];

const NotificationPage = () => {
  const handleMarkAsRead = (id: number) => {
    // Logic to mark a notification as read (update the `isRead` status)
    console.log(`Marking notification ${id} as read`);
    // Update the notification status to "read"
  };

  const handleDeleteNotification = (id: number) => {
    // Logic to delete a notification (remove from array or set `isRead` to true)
    console.log(`Deleting notification ${id}`);
    // Remove or mark the notification as deleted
  };

  return (
    <PageContainer
      title="Notification Page"
      description="Here you can view your notifications"
    >
      <DashboardCard title="Recent Notifications">
        <List>
          {notifications.map((notification) => (
            <div key={notification.id}>
              <ListItem
                divider
                sx={{
                  backgroundColor: notification.isRead
                    ? "transparent"
                    : "#f3f4f6",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                <ListItemText
                  primary={notification.message}
                  secondary={`Received: ${notification.time}`}
                />
                <Button
                  onClick={() => handleMarkAsRead(notification.id)}
                  variant="outlined"
                  color="primary"
                  size="small"
                  sx={{ marginRight: 1 }}
                >
                  Mark as Read
                </Button>
                <Button
                  onClick={() => handleDeleteNotification(notification.id)}
                  variant="outlined"
                  color="error"
                  size="small"
                >
                  Delete
                </Button>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>

        {notifications.length === 0 && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ marginTop: 2 }}
          >
            No notifications available.
          </Typography>
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default NotificationPage;
