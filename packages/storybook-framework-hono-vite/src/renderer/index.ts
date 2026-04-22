import type { JSX as HonoJSX } from 'hono/jsx/jsx-dev-runtime';
import type {
  AnnotatedStoryFn,
  Args,
  ArgsFromMeta,
  ArgsStoryFn,
  Canvas,
  ComponentAnnotations,
  ComposedStoryFn,
  DecoratorFunction,
  LoaderFunction,
  NamedOrDefaultProjectAnnotations,
  NormalizedProjectAnnotations,
  ProjectAnnotations,
  Store_CSFExports,
  StoriesWithPartialProps,
  StoryAnnotations,
  StoryAnnotationsOrFn,
  StoryContext as StoryContextBase,
  StrictArgs,
  WebRenderer,
} from 'storybook/internal/types';
export type { Args, ArgTypes, Parameters, StrictArgs } from 'storybook/internal/types';
import {
  composeConfigs,
  composeStories as originalComposeStories,
  composeStory as originalComposeStory,
  setDefaultProjectAnnotations,
  setProjectAnnotations as originalSetProjectAnnotations,
} from 'storybook/preview-api';
import * as entryPreview from './entry-preview.js';

type Filter<KeyType, ExcludeType> =
  IsEqual<KeyType, ExcludeType> extends true
    ? never
    : KeyType extends ExcludeType
      ? never
      : KeyType;

type IsEqual<T, U> =
  (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2 ? true : false;

type Except<ObjectType, KeysType extends keyof ObjectType> = {
  [KeyType in keyof ObjectType as Filter<KeyType, KeysType>]: ObjectType[KeyType];
};

type Flatten<AnyType> = {
  [KeyType in keyof AnyType]: AnyType[KeyType];
};

type Simplify<AnyType> = Flatten<AnyType> extends AnyType ? Flatten<AnyType> : AnyType;

type SetOptional<BaseType, Keys extends keyof BaseType> = Simplify<
  Except<BaseType, Keys> & Partial<Pick<BaseType, Keys>>
>;

type AnyComponent = (args: any, ...rest: any[]) => unknown;

type ComponentProps<TComponent> = TComponent extends (...args: infer TArgs) => unknown
  ? TArgs extends [infer TProps, ...unknown[]]
    ? TProps
    : Record<string, never>
  : never;

export type HonoStoryResult = HonoJSX.Element | null;

export interface HonoRenderer extends WebRenderer {
  component: AnyComponent;
  storyResult: HonoStoryResult;
  mount: (ui?: HonoStoryResult) => Promise<Canvas>;
}

export interface HonoParameters {
  hono?: {
    rootOptions?: Record<string, unknown>;
  };
}

export interface HonoTypes extends HonoRenderer {
  parameters: HonoParameters;
}

export type Meta<TCmpOrArgs = Args> = [TCmpOrArgs] extends [AnyComponent]
  ? ComponentAnnotations<HonoRenderer, ComponentProps<TCmpOrArgs>>
  : ComponentAnnotations<HonoRenderer, TCmpOrArgs>;

export type StoryFn<TCmpOrArgs = Args> = [TCmpOrArgs] extends [AnyComponent]
  ? AnnotatedStoryFn<HonoRenderer, ComponentProps<TCmpOrArgs>>
  : AnnotatedStoryFn<HonoRenderer, TCmpOrArgs>;

export type StoryObj<TMetaOrCmpOrArgs = Args> = [TMetaOrCmpOrArgs] extends [
  {
    render?: ArgsStoryFn<HonoRenderer, any>;
    component?: infer Component;
    args?: infer DefaultArgs;
  },
]
  ? Simplify<
      (Component extends AnyComponent ? ComponentProps<Component> : unknown) &
        ArgsFromMeta<HonoRenderer, TMetaOrCmpOrArgs>
    > extends infer TArgs
    ? StoryAnnotations<
        HonoRenderer,
        AddMocks<TArgs, DefaultArgs>,
        SetOptional<TArgs, keyof TArgs & keyof DefaultArgs>
      >
    : never
  : TMetaOrCmpOrArgs extends AnyComponent
    ? StoryAnnotations<HonoRenderer, ComponentProps<TMetaOrCmpOrArgs>>
    : StoryAnnotations<HonoRenderer, TMetaOrCmpOrArgs>;

// Downcast to function types that are mocks, when a mock fn is given to meta args.
export type AddMocks<TArgs, DefaultArgs> = Simplify<{
  [T in keyof TArgs]: T extends keyof DefaultArgs
    ? DefaultArgs[T] extends (...args: any) => any & { mock: {} }
      ? DefaultArgs[T]
      : TArgs[T]
    : TArgs[T];
}>;

export type Decorator<TArgs = StrictArgs> = DecoratorFunction<HonoRenderer, TArgs>;
export type Loader<TArgs = StrictArgs> = LoaderFunction<HonoRenderer, TArgs>;
export type StoryContext<TArgs = StrictArgs> = StoryContextBase<HonoRenderer, TArgs>;
export type Preview = ProjectAnnotations<HonoRenderer>;

const globalProjectAnnotations = () =>
  (globalThis as { globalProjectAnnotations?: ProjectAnnotations<HonoRenderer> })
    .globalProjectAnnotations;

export const INTERNAL_DEFAULT_PROJECT_ANNOTATIONS = composeConfigs([
  entryPreview,
]) as NormalizedProjectAnnotations<HonoRenderer>;

export function definePreview<TPreview extends Preview>(preview: TPreview): TPreview {
  return preview;
}

export function setProjectAnnotations(
  projectAnnotations:
    | NamedOrDefaultProjectAnnotations<any>
    | NamedOrDefaultProjectAnnotations<any>[],
): NormalizedProjectAnnotations<HonoRenderer> {
  setDefaultProjectAnnotations(INTERNAL_DEFAULT_PROJECT_ANNOTATIONS);

  return originalSetProjectAnnotations(projectAnnotations);
}

export function composeStory<TArgs extends Args = Args>(
  story: StoryAnnotationsOrFn<HonoRenderer, TArgs>,
  componentAnnotations: Meta<any>,
  projectAnnotations?: ProjectAnnotations<HonoRenderer>,
  exportsName?: string,
): ComposedStoryFn<HonoRenderer, Partial<TArgs>> {
  return originalComposeStory(
    story as StoryAnnotationsOrFn<any, any>,
    componentAnnotations as Meta<any>,
    projectAnnotations as ProjectAnnotations<any> | undefined,
    (globalProjectAnnotations() ?? INTERNAL_DEFAULT_PROJECT_ANNOTATIONS) as ProjectAnnotations<any>,
    exportsName,
  ) as ComposedStoryFn<HonoRenderer, Partial<TArgs>>;
}

export function composeStories<TModule extends Store_CSFExports<HonoRenderer, any>>(
  csfExports: TModule,
  projectAnnotations?: ProjectAnnotations<HonoRenderer>,
): Omit<StoriesWithPartialProps<HonoRenderer, TModule>, keyof Store_CSFExports> {
  return (originalComposeStories as any)(
    csfExports as Store_CSFExports<any, any>,
    (projectAnnotations ?? {}) as ProjectAnnotations<any>,
    composeStory as any,
  ) as Omit<StoriesWithPartialProps<HonoRenderer, TModule>, keyof Store_CSFExports>;
}
