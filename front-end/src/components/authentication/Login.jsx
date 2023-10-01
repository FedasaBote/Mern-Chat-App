import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const toast = useToast();
  const history = useNavigate();

  async function submitHandler() {
    setLoading(true);

    if (!form.email || !form.password) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duratin: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "Logged Successfully",
        status: "success",
        duratin: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history("/chats");
      // history is used to redirect to a new page
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: err.response.message,
        status: "error",
        duratin: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      console.log(err);
    }
  }

  return (
    <VStack spacing="5px" color="black">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          value={form.email}
          placeholder="Enter you Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            value={form.password}
            placeholder="Enter your Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="teal"
        variant="solid"
        width="100%"
        style={{ marginTop: 15 }}
        loading={undefined || loading}
        onClick={() => submitHandler()}
      >
        Login
      </Button>

      <Button
        colorScheme="red"
        variant="solid"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={() => {
          setForm({
            email: "guest@example.com",
            password: "123456",
          });
          // submitHandler();
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
}
