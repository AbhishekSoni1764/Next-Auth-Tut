"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { messageData } from "@/app/data/messageData";

const PublicPage = () => {
  const [messages, setMessages] = useState(messageData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleCopy = (message: string) => {
    navigator.clipboard.writeText(message);
    form.setValue("content", message);

    toast({
      title: "Copied to Clipboard!",
    });
  };

  const suggestMessage = async () => {
    setIsSuggesting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/suggest-messages`);
      if (response.status === 200) {
        toast({
          title: "Sussessfull!! Choose or Re-generate!",
          description: response.statusText,
        });

        // console.log(response.data.message.split("||"));
        setMessages(response?.data.message.split("||"));
      } else {
        toast({
          title: "Failed to regenerate!",
          description: response.statusText,
        });
      }
    } catch (error) {
      console.error("Something went wrong while suggesting messages!!", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Gemini Didn't work!",
        description:
          axiosError.response?.data.message ??
          "Something went wrong while suggesting messages!!",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/send-message`, {
        username: params.username,
        content: data.content,
      });

      if (response.data.success === true) {
        toast({
          title: "Message Sent!!",
          description: response.data.message,
        });
      } else {
        toast({
          title: "Message sending unsuccessfull!!",
          description: response.data.message,
        });
      }

      form.reset();
    } catch (error) {
      console.error("Something went wrong while sending message!!", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Failed to Send!",
        description:
          axiosError.response?.data.message ??
          "Something went wrong while sending message!!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-start items-center min-h-screen bg-gray-800 p-10">
      <div className="w-full max-w-[70%] flex flex-col justify-center items-center">
        <h1 className="text-4xl text-gray-300 tracking-tight font-extrabold lg:text-5xl mb-6">
          Public Profile Link
        </h1>
        <div className="w-full flex flex-col justify-center items-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full flex flex-col"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">
                      Send Anonymous Message to @{params?.username}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-16 text-gray-300"
                        placeholder="Write your Anonymous Message Here.."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-28 self-center bg-slate-400 text-black hover:bg-slate-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Send It"
                )}
              </Button>
            </form>
          </Form>
        </div>
        <Button
          onClick={() => suggestMessage()}
          disabled={isSuggesting}
          className="bg-slate-400 text-black hover:bg-slate-300 my-10 self-start"
        >
          {isSuggesting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Suggest Messages"
          )}
        </Button>
        <div className="w-full p-8 space-y-8 border-[1px] rounded-lg shadow-md text-gray-800">
          {messages.map((message, index) => (
            <div
              key={index}
              onClick={() => handleCopy(message)}
              className="cursor-pointer"
            >
              <p className="px-4 py-3 border-[1px] border-gray-400 bg-slate-400 rounded-md shadow-lg font-semibold">
                {message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicPage;
