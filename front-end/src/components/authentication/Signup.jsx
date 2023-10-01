import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: undefined,
  });
  function postDetails(pic) {
    setLoading(true);

    if (pic === undefined) {
      toast({
        title: "Please select an Image",
        status: "warning",
        duratin: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dxhtqebzu");
      fetch("https://api.cloudinary.com/v1_1/dxhtqebzu/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setForm({ ...form, pic: data.url });
          setLoading(false);
          console.log(data);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  }

  async function submitHandler() {
    setLoading(true);

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
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
    if (form.password !== form.confirmPassword) {
      toast({
        title: "Password did not match",
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
        "http://localhost:5000/api/user",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "Account Created Successfully",
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
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter you name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter you Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
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
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type={show ? "text" : "password"}
          placeholder="Confirm you Password"
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />
      </FormControl>

      <FormControl id="pic" isRequired>
        <FormLabel>Profile Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="teal"
        variant="solid"
        width="100%"
        style={{ marginTop: 15 }}
        isLoading={loading}
        onClick={submitHandler}
      >
        Sign Up
      </Button>
    </VStack>
  );
}
