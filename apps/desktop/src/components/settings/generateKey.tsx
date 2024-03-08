import { Button, useDisclosure, useToast, Text } from "@chakra-ui/react";
import { api } from "../../lib/api";
import { API_URL } from "../../lib/api/constants";
import { useGenerateApiKey } from "../../lib/api/mutations/settings";
import Modal from "../modal";

const GenerateKey = () => {
  // const queryClient = use
  // const
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: generateKey } = useGenerateApiKey({ onClose });

  const handleGenerateKey = () => {
    generateKey()
  }
  return (
    <>
      <Button mt={5} onClick={onOpen}>
        Generate API Key
      </Button>
      <Modal
        title="Are you sure?"
        isOpen={isOpen}
        onClose={onClose}
        onAction={handleGenerateKey}
        actionText="Generate"
      >
        <Text >This will generate a new key</Text>
        <Text>All applications using the old key will no longer work</Text>
      </Modal>
    </>
  );
};

export default GenerateKey
