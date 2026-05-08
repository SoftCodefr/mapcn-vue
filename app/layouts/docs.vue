<template>
  <div class="flex min-h-screen flex-col">
    <SiteHeader />
    <div class="mx-auto flex w-full max-w-screen-2xl flex-1 px-6">
      <DocsSidebar />
      <main class="flex w-full min-w-0 flex-1">
        <slot />
      </main>
    </div>
    <SiteFooter />
  </div>
</template>
