import UserCard from "./user-card";

const UserList = ({ users, onToggle }) => {
  if (!users?.length) return <p className="text-center">Không có người dùng nào.</p>;
  return (
    <div className="space-y-4">
      {users.map((u) => (
        <UserCard key={u.id} user={u} onToggle={onToggle} />
      ))}
    </div>
  );
};

export default UserList;
