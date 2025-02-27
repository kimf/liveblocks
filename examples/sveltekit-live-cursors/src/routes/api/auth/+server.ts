import { json } from "@sveltejs/kit";
import { authorize } from "@liveblocks/node";

const API_KEY = import.meta.env.VITE_LIVEBLOCKS_SECRET_KEY as string;
// @ts-ignore
const API_KEY_WARNING = process.env.CODESANDBOX_SSE
  ? `Add your secret key from https://liveblocks.io/dashboard/apikeys as the \`VITE_LIVEBLOCKS_SECRET_KEY\` secret in CodeSandbox.\n` +
    `Learn more: https://github.com/liveblocks/liveblocks/tree/main/examples/sveltekit-live-cursors#codesandbox.`
  : `Create an \`.env.local\` file and add your secret key from https://liveblocks.io/dashboard/apikeys as the \`VITE_LIVEBLOCKS_SECRET_KEY\` environment variable.\n` +
    `Learn more: https://github.com/liveblocks/liveblocks/tree/main/examples/sveltekit-live-cursors#getting-started.`;

export async function POST({ request }) {
  const { room } = await request.json();

  if (!API_KEY) {
    console.warn(API_KEY_WARNING);

    return json(
      { message: API_KEY_WARNING },
      {
        status: 403,
      }
    );
  }

  if (!room) {
    return new Response(undefined, { status: 403 });
  }

  const response = await authorize({
    room: room,
    secret: API_KEY,
  });

  return new Response(response.body, { status: response.status });
}
