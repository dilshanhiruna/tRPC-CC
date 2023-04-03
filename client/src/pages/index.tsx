import {
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  wsLink,
} from "@trpc/client";
import { useEffect } from "react";
import { AppRouter } from "../../../api";

function getEndingLink() {
  if (typeof window === "undefined") {
    return httpBatchLink({
      url: "http://localhost:4200/trpc",
    });
  }
  const client = createWSClient({
    url: "ws://localhost:4200/trpc",
  });
  return wsLink<AppRouter>({
    client,
  });
}

const client = createTRPCProxyClient<AppRouter>({
  links: [getEndingLink()],
});

export default function Home() {
  useEffect(() => {
    async function fetchData() {
      const res = client.onUpdate.subscribe(undefined, {
        onData: (data) => {
          console.log("updateUser", data);
        },
      });
    }
    fetchData();
  }, []);

  return (
    <>
      <button
        onClick={async () => {
          await client.update.mutate({ id: "1", name: "jon" });
        }}
      >
        update
      </button>
    </>
  );
}
