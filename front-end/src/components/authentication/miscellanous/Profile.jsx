import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  Button,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  IconButton,
  Image,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
function Profile(props) {
  const { user, children } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          d={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        ></IconButton>
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered={true}>
        {/* <ModalOverlay /> */}
        <ModalContent>
          <Flex>
            <ModalHeader
              fontFamily="Work sans"
              fontSize="40px"
              justifyContent="center"
            >
              {user.name}
            </ModalHeader>
          </Flex>
          <ModalCloseButton />
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <ModalBody>
              <Image
                borderRadius="full"
                boxSize="150px"
                alt={user.name}
                src={user.pic}
              ></Image>
              <Text
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
              >
                Email:{user.email}
              </Text>
            </ModalBody>
          </Flex>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Profile;
