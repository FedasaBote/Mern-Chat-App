import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
function UserListItem({ user, handleFunction }) {
  return (
    <Flex
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{ background: "#38821c" }}
      width="100%"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        name={user.name}
        src={user.pic}
        cursor="pointer"
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b> {user.email}
        </Text>
      </Box>
    </Flex>
  );
}
UserListItem.propTypes = {
  user: PropTypes.object.isRequired,
  handleFunction: PropTypes.func.isRequired,
};
export default UserListItem;
