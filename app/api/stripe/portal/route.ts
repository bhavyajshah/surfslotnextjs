import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get or create Stripe customer
    let customer;
    // Here you would typically lookup the customer ID from your database
    // For now, we'll create a new customer if one doesn't exist
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    });
    
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: session.user.email!,
        metadata: {
          userId: session.user.id,
        },
      });
    }

    // Create billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: \`\${process.env.NEXTAUTH_URL}/dashboard\`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}