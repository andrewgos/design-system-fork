import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { fuzzComponent } from '../../tests/utils/fuzzComponent';
import { Accordion, AccordionProps } from './Accordion';

describe('Accordion: Unit Test', () => {
  const baseItems = [
    {
      eventKey: '0',
      heading: 'Heading',
      content: 'Accordion content',
    },
  ];

  it('applies mds class name', () => {
    const { container } = render(<Accordion items={baseItems} />);
    const accordionElement = container.querySelector('.mds-accordion');
    expect(accordionElement).not.toBeNull();
  });

  it('renders all item headings', () => {
    render(
      <Accordion
        items={[
          { eventKey: '0', heading: 'First Heading', content: 'First body' },
          { eventKey: '1', heading: 'Second Heading', content: 'Second body' },
        ]}
      />,
    );

    expect(screen.getByRole('button', { name: 'First Heading' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Second Heading' })).toBeTruthy();
  });

  it('expands item content when heading is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<Accordion items={baseItems} />);

    const collapseElement = container.querySelector('.accordion-collapse');
    expect(collapseElement?.classList.contains('show')).toBe(false);

    await user.click(screen.getByRole('button', { name: 'Heading' }));

    expect(collapseElement?.classList.contains('show')).toBe(true);
  });

  it('applies info variant class', () => {
    const { container } = render(
      <Accordion items={baseItems} variant="info" />,
    );
    expect(
      container
        .querySelector('.mds-accordion')
        ?.classList.contains('mds-accordion--info'),
    ).toBe(true);
  });

  it('falls back to default variant when an invalid value is provided', () => {
    const { container } = render(
      <Accordion
        items={baseItems}
        variant={'invalid' as unknown as AccordionProps['variant']}
      />,
    );
    expect(
      container
        .querySelector('.mds-accordion')
        ?.classList.contains('mds-accordion--default'),
    ).toBe(true);
  });

  it('forwards additional props to the root accordion element', () => {
    render(<Accordion items={baseItems} data-testid="custom-accordion" />);
    expect(screen.getByTestId('custom-accordion')).toBeTruthy();
  });

  it('renders and displays heading for random props', () => {
    fuzzComponent(
      Accordion,
      fc.record<AccordionProps>({
        items: fc
          .array(
            fc.record({
              eventKey: fc.option(fc.string(), { nil: undefined }),
              heading: fc.stringOf(
                fc.constantFrom(
                  ...('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split(
                    '',
                  ) as [string, ...string[]]),
                ),
                { minLength: 1, maxLength: 50 },
              ),
              content: fc.option(fc.string(), { nil: undefined }),
            }),
            { minLength: 1, maxLength: 3 },
          )
          .map((items) =>
            items.map((item, index) => ({
              ...item,
              eventKey: item.eventKey ?? String(index),
            })),
          ),
        variant: fc.option(fc.constantFrom('default', 'info'), {
          nil: undefined,
        }) as unknown as fc.Arbitrary<AccordionProps['variant']>,
      }),
      (props: AccordionProps) => props.items[0].heading,
      { numRuns: 50 },
    );
  });
});
