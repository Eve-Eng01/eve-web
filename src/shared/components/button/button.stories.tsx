import type { Meta, StoryObj } from "@storybook/react";
import { CustomButton } from "./button";
import { Plus, Loader2 } from "lucide-react";

const meta: Meta<typeof CustomButton> = {
  title: "Components/CustomButton",
  component: CustomButton,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    disabled: { control: "boolean" },
    className: { control: "text" },
    onClick: { action: "clicked" },
    icon: {
      control: false,
      description: "Optional icon to display on the left of the button",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CustomButton>;

export const Default: Story = {
  args: {
    title: "Click Me",
  },
};

export const WithIcon: Story = {
  args: {
    title: "Add Item",
    icon: <Plus />,
  },
};

export const Disabled: Story = {
  args: {
    title: "Disabled Button",
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    title: "Loading...",
    icon: <Loader2 className="animate-spin" size={20} />,
    disabled: true,
  },
};
