import postcss from 'postcss';
import { describe, it, expect } from 'vitest';
import plugin from '../src';

const processing = (input, options) => {
  return postcss([plugin(options)]).process(input).css;
};

describe('PostCSS Plugin Tests', () => {
  it('changes circular reference with declarationByWalk option', () => {
    const expected = ':root { --nested-var: calc(2 * var(--original-var)); } .class-name { @mixin mixinName calc(2 * 4px); } :root { --original-var: 4px; }';
    const value = ':root { --nested-var: calc(2 * var(--original-var)); } .class-name { @mixin mixinName var(--nested-var); } :root { --original-var: 4px; }';
    expect(processing(value, { declarationByWalk: true })).toBe(expected);
  });

  it('changes circular reference', () => {
    const expected = ':root{ --from: 1; --to: var(--from)} @for $i from 1 to 1';
    const value = ':root{ --from: 1; --to: var(--from)} @for $i from var(--from) to var(--to)';
    expect(processing(value)).toBe(expected);
  });

  it('should not throw error if comment exists', () => {
    const expected = ':root{ --from: 1; /* comment */ }';
    const value = ':root{ --from: 1; /* comment */ }';
    expect(processing(value)).toBe(expected);
  });

  it('should not throw error if comment exists with rule', () => {
    const expected = ':root{ --from: 1; /* comment */ } @for $i from 1 to 2';
    const value = ':root{ --from: 1; /* comment */ } @for $i from var(--from) to 2';
    expect(processing(value)).toBe(expected);
  });

  it('changes first properties for @for', () => {
    const expected = ':root{ --from: 1; } @for $i from 1 to 2';
    const value = ':root{ --from: 1; } @for $i from var(--from) to 2';
    expect(processing(value)).toBe(expected);
  });

  it('changes second properties for @for', () => {
    const expected = ':root{ --to: 2; } @for $i from 1 to 2';
    const value = ':root{ --to: 2; } @for $i from 1 to var(--to)';
    expect(processing(value)).toBe(expected);
  });

  it('changes two properties for @for', () => {
    const expected = ':root{ --from: 1; --to: 2; } @for $i from 1 to 2';
    const value = ':root{ --from: 1; --to: 2; } @for $i from var(--from) to var(--to)';
    expect(processing(value)).toBe(expected);
  });

  it('changes three properties for @for', () => {
    const expected = ':root{ --from: 1; --to: 2; --step: 5 } @for $i from 1 to 2 by 5 ';
    const value = ':root{ --from: 1; --to: 2; --step: 5 } @for $i from var(--from) to var(--to) by var(--step)';
    expect(processing(value)).toBe(expected);
  });

  it('changes two properties for @if', () => {
    const expected = ':root{ --first: 1; --second: 2; } @if 1 < 2';
    const value = ':root{ --first: 1; --second: 2; } @if var(--first) < var(--second)';
    expect(processing(value, { atRules: ['if'] })).toBe(expected);
  });

  it('changes two properties for @if, @else if', () => {
    const expected = ':root{ --first: 1; --second: 2; } @if 1 < 2 { color: olive; } @else if 1 > 2 { color: red; }';
    const value = ':root{ --first: 1; --second: 2; } @if var(--first) < var(--second) { color: olive; } @else if var(--first) > var(--second) { color: red; }';
    expect(processing(value, { atRules: ['if', 'else'] })).toBe(expected);
  });

  it('changes multiple properties for @each', () => {
    const expected = ':root{ --array: foo, bar, baz; } @each $val in foo, bar, baz {} @for foo, bar, baz {}';
    const value = ':root{ --array: foo, bar, baz; } @each $val in var(--array) {} @for var(--array) {}';
    expect(processing(value, { atRules: ['each'] })).toBe(expected);
  });

  it('works without variables', () => {
    const expected = ':root{ --red: red; } @if var(--green) { color: var(--green) }';
    const value = ':root{ --red: red; } @if var(--green) { color: var(--green) }';
    expect(processing(value)).toBe(expected);
  });

  it('should change from options variables', () => {
    const expected = '@if green { .text-green { color: var(--green) }}';
    const value = '@if var(--green) { .text-green { color: var(--green) }}';
    const variables = {
      '--green': 'green'
    };
    expect(processing(value, { variables: variables })).toBe(expected);
  });

  it('should change for @custom-media', () => {
    const expected = ':root{ --breakpoint-xs: 29.25em } @custom-media --viewport-xs (width > 29.25em )';
    const value = ':root{ --breakpoint-xs: 29.25em } @custom-media --viewport-xs (width > var(--breakpoint-xs))';
    expect(processing(value, { atRules: ['custom-media'] })).toBe(expected);
  });
});
