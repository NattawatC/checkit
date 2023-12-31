import * as z from 'zod'

export const registerFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(40),

    email: z.string().min(1, 'Email is required').email('Invalid email'),
     //TODO: uncomment this when we have a backend
  // .refine(async (e) => {
  //   // Where checkIfEmailIsValid makes a request to the backend
  //   // to see if the email is valid.
  //   return await checkIfEmailIsValid(e);
  // }, "This email is not in our database")

    password: z.string().min(1, 'Password is required').min(8, 'Password must have than 8 characters'),
})