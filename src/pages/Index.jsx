import React, { useState, useRef } from "react";
import { Container, VStack, Input, Button, Text, FormControl, FormLabel, useToast, Image, Tooltip } from "@chakra-ui/react";
import { FaCertificate, FaInfoCircle, FaPlus, FaLock, FaCheck } from "react-icons/fa";

const Index = () => {
  const fileInputRef = useRef(null);
  const toast = useToast();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    console.log("Submitting files:", selectedFiles);
    toast({
      title: "Files Submitted",
      description: "Your files have been submitted and are being processed. You will receive your certificate shortly.",
      status: "success",
      duration: 10000,
      position: "top-right",
      isClosable: true,
      colorScheme: "green",
    });

    setIsSubmitting(true);
    setSelectedFiles([]);
  };

  return (
    <Container centerContent maxW="container.md" minH="100vh" display="flex" flexDirection="column" justifyContent="space-between" alignItems="center" background="linear-gradient(120deg, #9DCEFF, #92FE9D)">
      <Button
        colorScheme="blue"
        position="absolute"
        top="20px"
        right="20px"
        onClick={async () => {
          const embeddedWallet = () => ({ connect: () => Promise.resolve("Connected to personal wallet") });
          const smartWallet = () => ({ connect: () => Promise.resolve("Connected to smart wallet") });
          const client = "MockClient";
          const chain = "MockChain";

          try {
            const personalWallet = embeddedWallet();
            const personalAccount = await personalWallet.connect({
              client,
              chain,
              strategy: "google",
            });

            const wallet = smartWallet({
              chain,
              factoryAddress: "0x63Cd5e48583e331d06c52Be8d88149734c240fC2",
              gasless: true,
            });
            const smartAccount = await wallet.connect({
              client,
              personalWallet,
            });

            console.log("Wallets connected:", { personalAccount, smartAccount });
          } catch (error) {
            console.error("Error connecting wallets:", error);
            toast({
              title: "Connection Error",
              description: "Failed to connect wallets. Please try again.",
              status: "error",
              duration: 9000,
              isClosable: true,
              position: "top-right",
            });
          }
        }}
      >
        Connect Wallet
      </Button>
      <VStack
        spacing={4}
        as="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        style={{ marginTop: "60px" }}
      >
        <Text fontSize="3xl" style={{ alignSelf: "flex-start", marginLeft: "20px", marginTop: "20px", fontFamily: "Arial Black, sans-serif", color: "#2a69ac", textShadow: "2px 2px 4px #153e75" }}>
          SecureLink <FaLock style={{ color: "#2a69ac", marginLeft: "8px" }} />
        </Text>
        <Text fontSize="3xl" mb={4} style={{ alignSelf: "flex-start", marginLeft: "20px", color: "#2a69ac", fontFamily: "Georgia, serif" }}>
          Verify the authenticity of your files with blockchain-based AI detection technology.
        </Text>
        <FormControl>
          <FormLabel htmlFor="file" display="flex" alignItems="center">
            Drag & Drop or Browse Files
            <Tooltip label="Documents: .pdf, .doc, .docx, .odt, .rtf, Images: .jpg, .jpeg, .png, .gif, .bmp, .tiff, .svg, Audio: .mp3, .wav, .aac, .ogg, .m4a, Video: .mp4, .mov, .wmv, .avi, .mpeg, Archives: .zip, .rar, .7z, .tar.gz" ml={2} color="#2a69ac" placement="bottom-start">
              <FaInfoCircle />
            </Tooltip>
          </FormLabel>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="green"
            w="full"
            h="200px"
            p={5}
            boxShadow="lg"
            bg="white"
            _hover={{ bg: "gray.100" }}
            onClick={() => fileInputRef.current.click()}
            onDrop={(e) => {
              e.preventDefault();
              const newFiles = Array.from(e.dataTransfer.files);
              setSelectedFiles([...selectedFiles, ...newFiles]);
              toast({
                title: "Files Uploaded",
                description: `${newFiles.length} file(s) uploaded successfully.`,
                status: "info",
                duration: 10000,
                position: "top-right",
                isClosable: true,
              });
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "verify";
            }}
          >
            {selectedFiles.map((file, index) => (
              <Tooltip key={index} label={file.name} hasArrow>
                <Image src={URL.createObjectURL(file)} boxSize="50px" m={1} />
              </Tooltip>
            ))}
            <FaPlus color="green" size="3em" />
            <Input
              id="file"
              type="file"
              ref={fileInputRef}
              multiple
              p={5}
              display="none"
              onChange={(e) => {
                const newFiles = Array.from(e.target.files);
                setSelectedFiles([...selectedFiles, ...newFiles]);
                newFiles.forEach((file) => {
                  toast({
                    title: "File Ready to Verify",
                    description: `File selected: ${file.name}`,
                    status: "success",
                    duration: 10000,
                    position: "top-right",
                    isClosable: true,
                    icon: <FaCheck />,
                  });
                });
              }}
            />
          </Button>
          <Text fontSize="sm" mt={2} color="gray.500">
            Upload your file to determine if it has been generated by artificial intelligence. Each file is thoroughly analyzed and categorized as either generative or non-generative. You will receive your original file with unaltered content but with updated metadata that reflects the verification result. Additionally, an NFT linked to your wallet will be minted, serving as a digital certificate and connecting the new metadata with its digital twin.
          </Text>
        </FormControl>
        <Button mt={8} colorScheme="green" type="submit" isLoading={isSubmitting} loadingText="Verifying...">
          {isSubmitting ? "Verifying..." : "Verify Now"}
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;
