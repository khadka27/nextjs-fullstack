"use client";

import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import router from "next/router";
import React from "react";


import * as z from "zod";
import { ApiResponse } from "../../../../../types/apiResponse";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
const VerifyAccount = () => {
  const route = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
      toast({
        title: "Account verified",
        description: response.data.message,
      });
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error verifying account", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Error verifying account",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 shadow-md rounded-md w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">Verify Code</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-gray-700 dark:text-gray-300 font-medium">Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your code"
                      {...field}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:focus:ring-indigo-500 dark:focus:ring-opacity-50"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 mt-1" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;
