import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeProvider } from 'react-bootstrap';
import { expect, fn } from 'storybook/test';
import { Accordion } from './Accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
⚠️ **This component is under development and not production ready.** API may change without notice.

Accordion wraps React-Bootstrap accordion behavior with Moodle Design System token-based styles.
Use the \`variant\` prop to choose between neutral and info emphasis variants from Figma.
        `,
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9zvbdhx3NdiOv0GL7fCA7u/MDS-473?node-id=28-261&t=WOhVusVAwHhHNCAZ-1',
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ width: '422px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  tags: ['autodocs', 'test', 'stable'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'info'],
      description:
        'Visual treatment for accordion item backgrounds and text colors.',
      table: {
        type: { summary: 'default | info' },
        defaultValue: { summary: 'default' },
      },
    },
    items: {
      control: { type: 'object' },
      description: 'Accordion items rendered in order.',
      table: {
        type: {
          summary:
            '{ eventKey?: string; heading: string; content?: ReactNode }[]',
        },
      },
    },
  },
  args: {
    variant: 'default',
    items: [
      {
        eventKey: '0',
        heading: 'Heading',
        content:
          'This is a paragraph dpwoa kdawopkda wdkd wopdawkoawdpawdpokadwk dwapoadwkadwko.',
      },
    ],
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Heading' });
    await expect(trigger).toBeVisible();
    await userEvent.click(trigger);
    await expect(
      canvas.getByText(
        'This is a paragraph dpwoa kdawopkda wdkd wopdawkoawdpawdpokadwk dwapoadwkadwko.',
      ),
    ).toBeVisible();
  },
} satisfies Story;

export const Info = {
  args: {
    variant: 'info',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Heading' })).toBeVisible();
  },
} satisfies Story;

export const Expanded = {
  args: {
    defaultActiveKey: '0',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText(
        'This is a paragraph dpwoa kdawopkda wdkd wopdawkoawdpawdpokadwk dwapoadwkadwko.',
      ),
    ).toBeVisible();
  },
} satisfies Story;

export const MultipleItems = {
  args: {
    items: [
      {
        eventKey: '0',
        heading: 'First Heading',
        content: 'First item content',
      },
      {
        eventKey: '1',
        heading: 'Second Heading',
        content: 'Second item content',
      },
    ],
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Second Heading' }),
    );
    await expect(canvas.getByText('Second item content')).toBeVisible();
  },
} satisfies Story;

export const SelectCallback = {
  args: {
    onSelect: fn(),
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Heading' }));
    await expect(args.onSelect).toHaveBeenCalled();
  },
} satisfies Story;
