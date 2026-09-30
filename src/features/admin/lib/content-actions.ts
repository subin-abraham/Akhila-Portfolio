'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  readInteger,
  readOptionalString,
  readString,
  requireNonEmpty,
} from '@/features/admin/lib/form-helpers';
import { parseError } from '@/features/admin/lib/parse-error';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import type { AdminActionState } from '@/types/components/admin-shell';
import { isSocialPlatform } from '@/features/home/lib/social-platforms';
import type { SocialPlatform } from '@/features/home/lib/social-platforms';

const EMPTY: AdminActionState = { error: null, success: null };

async function assertAuthenticated() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return user;
}

function revalidateContent(adminPath: string) {
  revalidatePath('/');
  revalidatePath(adminPath);
}

function fail(message: string): AdminActionState {
  return { ...EMPTY, error: parseError(message) };
}

function ok(message: string): AdminActionState {
  return { error: null, success: message };
}

export async function updateHomepage(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  const fullName = readString(formData, 'fullName');
  const intro = readString(formData, 'intro');
  const ctaLabel = readString(formData, 'ctaLabel');
  const ctaHref = readString(formData, 'ctaHref');

  const missing = requireNonEmpty({
    Id: id,
    'Full name': fullName,
    Intro: intro,
    'Button text': ctaLabel,
    'Button link': ctaHref,
  });

  if (missing) {
    return fail(missing);
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('homepage')
    .update({
      full_name: fullName,
      intro,
      cta_label: ctaLabel,
      cta_href: ctaHref,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/hero');
  return ok('Hero content saved.');
}

export async function updateFooter(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  const brandName = readString(formData, 'brandName');
  const tagline = readString(formData, 'tagline');
  const statusLabel = readString(formData, 'statusLabel');
  const ctaLabel = readString(formData, 'ctaLabel');
  const ctaHref = readString(formData, 'ctaHref');
  const copyrightName = readString(formData, 'copyrightName');

  const missing = requireNonEmpty({
    Id: id,
    'Brand name': brandName,
    Tagline: tagline,
    'Availability': statusLabel,
    'Button text': ctaLabel,
    'Button link': ctaHref,
    'Copyright name': copyrightName,
  });

  if (missing) {
    return fail(missing);
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('footer')
    .update({
      brand_name: brandName,
      tagline,
      status_label: statusLabel,
      cta_label: ctaLabel,
      cta_href: ctaHref,
      copyright_name: copyrightName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/footer');
  return ok('Footer content saved.');
}

export async function createNavLink(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const label = readString(formData, 'label');
  const href = readString(formData, 'href');
  const sortOrder = readInteger(formData, 'sortOrder') ?? 0;

  const missing = requireNonEmpty({ 'Link text': label, 'Link URL': href });
  if (missing) {
    return fail(missing);
  }

  const admin = createAdminClient();
  const { error } = await admin.from('nav_links').insert({
    label,
    href,
    sort_order: sortOrder,
  });

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/nav-links');
  return ok('Nav link added.');
}

export async function updateNavLink(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  const label = readString(formData, 'label');
  const href = readString(formData, 'href');
  const sortOrder = readInteger(formData, 'sortOrder');

  const missing = requireNonEmpty({ Id: id, 'Link text': label, 'Link URL': href });
  if (missing) {
    return fail(missing);
  }

  if (sortOrder === null) {
    return fail('Display order must be a number.');
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('nav_links')
    .update({ label, href, sort_order: sortOrder })
    .eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/nav-links');
  return ok('Nav link updated.');
}

export async function deleteNavLink(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  if (!id) {
    return fail('Id is required.');
  }

  const admin = createAdminClient();
  const { error } = await admin.from('nav_links').delete().eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/nav-links');
  return ok('Nav link deleted.');
}

export async function createSocialLink(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const platform = readString(formData, 'platform') as SocialPlatform;
  const href = readString(formData, 'href');
  const sortOrder = readInteger(formData, 'sortOrder') ?? 0;

  if (!isSocialPlatform(platform)) {
    return fail('Choose a supported social platform.');
  }

  if (!href) {
    return fail('Profile URL is required.');
  }

  const admin = createAdminClient();
  const { error } = await admin.from('social_links').insert({
    platform,
    href,
    sort_order: sortOrder,
  });

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/social-links');
  revalidatePath('/admin/footer');
  return ok('Social link added.');
}

export async function updateSocialLink(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  const platform = readString(formData, 'platform') as SocialPlatform;
  const href = readString(formData, 'href');
  const sortOrder = readInteger(formData, 'sortOrder');

  if (!id) {
    return fail('Id is required.');
  }

  if (!isSocialPlatform(platform)) {
    return fail('Choose a supported social platform.');
  }

  if (!href) {
    return fail('Profile URL is required.');
  }

  if (sortOrder === null) {
    return fail('Display order must be a number.');
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('social_links')
    .update({ platform, href, sort_order: sortOrder })
    .eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/social-links');
  revalidatePath('/admin/footer');
  return ok('Social link updated.');
}

export async function deleteSocialLink(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  if (!id) {
    return fail('Id is required.');
  }

  const admin = createAdminClient();
  const { error } = await admin.from('social_links').delete().eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/social-links');
  revalidatePath('/admin/footer');
  return ok('Social link deleted.');
}

export async function createWorkedWith(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const name = readString(formData, 'name');
  const sortOrder = readInteger(formData, 'sortOrder') ?? 0;

  const missing = requireNonEmpty({ Name: name });
  if (missing) {
    return fail(missing);
  }

  const admin = createAdminClient();
  const { error } = await admin.from('worked_with').insert({
    name,
    sort_order: sortOrder,
  });

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/worked-with');
  return ok('Company added.');
}

export async function updateWorkedWith(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  const name = readString(formData, 'name');
  const sortOrder = readInteger(formData, 'sortOrder');

  const missing = requireNonEmpty({ Id: id, Name: name });
  if (missing) {
    return fail(missing);
  }

  if (sortOrder === null) {
    return fail('Display order must be a number.');
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('worked_with')
    .update({ name, sort_order: sortOrder })
    .eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/worked-with');
  return ok('Company updated.');
}

export async function deleteWorkedWith(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  if (!id) {
    return fail('Id is required.');
  }

  const admin = createAdminClient();
  const { error } = await admin.from('worked_with').delete().eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/worked-with');
  return ok('Company deleted.');
}

export async function createProfessionalJourney(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const role = readString(formData, 'role');
  const organization = readString(formData, 'organization');
  const location = readOptionalString(formData, 'location');
  const period = readString(formData, 'period');
  const description = readString(formData, 'description');
  const sortOrder = readInteger(formData, 'sortOrder') ?? 0;

  const missing = requireNonEmpty({
    Role: role,
    Organization: organization,
    Period: period,
    Description: description,
  });

  if (missing) {
    return fail(missing);
  }

  const admin = createAdminClient();
  const { error } = await admin.from('professional_journey').insert({
    role,
    organization,
    location,
    period,
    description,
    sort_order: sortOrder,
  });

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/professional-journey');
  return ok('Journey entry added.');
}

export async function updateProfessionalJourney(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  const role = readString(formData, 'role');
  const organization = readString(formData, 'organization');
  const location = readOptionalString(formData, 'location');
  const period = readString(formData, 'period');
  const description = readString(formData, 'description');
  const sortOrder = readInteger(formData, 'sortOrder');

  const missing = requireNonEmpty({
    Id: id,
    Role: role,
    Organization: organization,
    Period: period,
    Description: description,
  });

  if (missing) {
    return fail(missing);
  }

  if (sortOrder === null) {
    return fail('Display order must be a number.');
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('professional_journey')
    .update({
      role,
      organization,
      location,
      period,
      description,
      sort_order: sortOrder,
    })
    .eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/professional-journey');
  return ok('Journey entry updated.');
}

export async function deleteProfessionalJourney(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  if (!id) {
    return fail('Id is required.');
  }

  const admin = createAdminClient();
  const { error } = await admin.from('professional_journey').delete().eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/professional-journey');
  return ok('Journey entry deleted.');
}

export async function createEducation(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const degree = readString(formData, 'degree');
  const institution = readString(formData, 'institution');
  const location = readOptionalString(formData, 'location');
  const period = readString(formData, 'period');
  const grade = readOptionalString(formData, 'grade');
  const description = readString(formData, 'description');
  const sortOrder = readInteger(formData, 'sortOrder') ?? 0;

  const missing = requireNonEmpty({
    Degree: degree,
    Institution: institution,
    Period: period,
    Description: description,
  });

  if (missing) {
    return fail(missing);
  }

  const admin = createAdminClient();
  const { error } = await admin.from('education').insert({
    degree,
    institution,
    location,
    period,
    grade,
    description,
    sort_order: sortOrder,
  });

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/education');
  return ok('Education entry added.');
}

export async function updateEducation(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  const degree = readString(formData, 'degree');
  const institution = readString(formData, 'institution');
  const location = readOptionalString(formData, 'location');
  const period = readString(formData, 'period');
  const grade = readOptionalString(formData, 'grade');
  const description = readString(formData, 'description');
  const sortOrder = readInteger(formData, 'sortOrder');

  const missing = requireNonEmpty({
    Id: id,
    Degree: degree,
    Institution: institution,
    Period: period,
    Description: description,
  });

  if (missing) {
    return fail(missing);
  }

  if (sortOrder === null) {
    return fail('Display order must be a number.');
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('education')
    .update({
      degree,
      institution,
      location,
      period,
      grade,
      description,
      sort_order: sortOrder,
    })
    .eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/education');
  return ok('Education entry updated.');
}

export async function deleteEducation(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  if (!id) {
    return fail('Id is required.');
  }

  const admin = createAdminClient();
  const { error } = await admin.from('education').delete().eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/education');
  return ok('Education entry deleted.');
}

export async function createBlogPost(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const title = readString(formData, 'title');
  const slug = readString(formData, 'slug');
  const excerpt = readString(formData, 'excerpt');
  const body = readString(formData, 'body');
  const publishedOn = readString(formData, 'publishedOn');
  const sortOrder = readInteger(formData, 'sortOrder') ?? 0;

  const missing = requireNonEmpty({
    Title: title,
    Slug: slug,
    Excerpt: excerpt,
    Body: body,
    'Published on': publishedOn,
  });

  if (missing) {
    return fail(missing);
  }

  const admin = createAdminClient();
  const { error } = await admin.from('blog_posts').insert({
    title,
    slug,
    excerpt,
    body,
    published_on: publishedOn,
    sort_order: sortOrder,
  });

  if (error) {
    return fail(error.message);
  }

  revalidatePath('/');
  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  return ok('Blog post added.');
}

export async function updateBlogPost(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  const title = readString(formData, 'title');
  const slug = readString(formData, 'slug');
  const excerpt = readString(formData, 'excerpt');
  const body = readString(formData, 'body');
  const publishedOn = readString(formData, 'publishedOn');
  const sortOrder = readInteger(formData, 'sortOrder');

  const missing = requireNonEmpty({
    Id: id,
    Title: title,
    Slug: slug,
    Excerpt: excerpt,
    Body: body,
    'Published on': publishedOn,
  });

  if (missing) {
    return fail(missing);
  }

  if (sortOrder === null) {
    return fail('Display order must be a number.');
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('blog_posts')
    .update({
      title,
      slug,
      excerpt,
      body,
      published_on: publishedOn,
      sort_order: sortOrder,
    })
    .eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidatePath('/');
  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  return ok('Blog post updated.');
}

export async function deleteBlogPost(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  if (!id) {
    return fail('Id is required.');
  }

  const admin = createAdminClient();
  const { error } = await admin.from('blog_posts').delete().eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidatePath('/');
  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  return ok('Blog post deleted.');
}

export async function createCaseStudy(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const title = readString(formData, 'title');
  const client = readOptionalString(formData, 'client');
  const period = readString(formData, 'period');
  const summary = readString(formData, 'summary');
  const description = readString(formData, 'description');
  const sortOrder = readInteger(formData, 'sortOrder') ?? 0;

  const missing = requireNonEmpty({
    Title: title,
    Period: period,
    Summary: summary,
    Description: description,
  });

  if (missing) {
    return fail(missing);
  }

  const admin = createAdminClient();
  const { error } = await admin.from('case_studies').insert({
    title,
    client,
    period,
    summary,
    description,
    sort_order: sortOrder,
  });

  if (error) {
    return fail(error.message);
  }

  revalidatePath('/');
  revalidatePath('/case-studies');
  revalidatePath('/admin/case-studies');
  return ok('Case study added.');
}

export async function updateCaseStudy(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  const title = readString(formData, 'title');
  const client = readOptionalString(formData, 'client');
  const period = readString(formData, 'period');
  const summary = readString(formData, 'summary');
  const description = readString(formData, 'description');
  const sortOrder = readInteger(formData, 'sortOrder');

  const missing = requireNonEmpty({
    Id: id,
    Title: title,
    Period: period,
    Summary: summary,
    Description: description,
  });

  if (missing) {
    return fail(missing);
  }

  if (sortOrder === null) {
    return fail('Display order must be a number.');
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('case_studies')
    .update({
      title,
      client,
      period,
      summary,
      description,
      sort_order: sortOrder,
    })
    .eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidatePath('/');
  revalidatePath('/case-studies');
  revalidatePath('/admin/case-studies');
  return ok('Case study updated.');
}

export async function deleteCaseStudy(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  if (!id) {
    return fail('Id is required.');
  }

  const admin = createAdminClient();
  const { error } = await admin.from('case_studies').delete().eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidatePath('/');
  revalidatePath('/case-studies');
  revalidatePath('/admin/case-studies');
  return ok('Case study deleted.');
}

export async function createTechnicalExpertise(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const category = readString(formData, 'category');
  const skill = readString(formData, 'skill');
  const proficiency = readInteger(formData, 'proficiency');
  const sortOrder = readInteger(formData, 'sortOrder') ?? 0;

  const missing = requireNonEmpty({ Category: category, Skill: skill });
  if (missing) {
    return fail(missing);
  }

  if (proficiency === null || proficiency < 0 || proficiency > 100) {
    return fail('Skill level must be a number from 0 to 100.');
  }

  const admin = createAdminClient();
  const { error } = await admin.from('technical_expertise').insert({
    category,
    skill,
    proficiency,
    sort_order: sortOrder,
  });

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/technical-expertise');
  return ok('Skill added.');
}

export async function updateTechnicalExpertise(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  const category = readString(formData, 'category');
  const skill = readString(formData, 'skill');
  const proficiency = readInteger(formData, 'proficiency');
  const sortOrder = readInteger(formData, 'sortOrder');

  const missing = requireNonEmpty({ Id: id, Category: category, Skill: skill });
  if (missing) {
    return fail(missing);
  }

  if (proficiency === null || proficiency < 0 || proficiency > 100) {
    return fail('Skill level must be a number from 0 to 100.');
  }

  if (sortOrder === null) {
    return fail('Display order must be a number.');
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('technical_expertise')
    .update({
      category,
      skill,
      proficiency,
      sort_order: sortOrder,
    })
    .eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/technical-expertise');
  return ok('Skill updated.');
}

export async function deleteTechnicalExpertise(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  if (!id) {
    return fail('Id is required.');
  }

  const admin = createAdminClient();
  const { error } = await admin.from('technical_expertise').delete().eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/technical-expertise');
  return ok('Skill deleted.');
}

export async function createToolsAndTechnology(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const category = readString(formData, 'category');
  const name = readString(formData, 'name');
  const sortOrder = readInteger(formData, 'sortOrder') ?? 0;

  const missing = requireNonEmpty({ Category: category, Name: name });
  if (missing) {
    return fail(missing);
  }

  const admin = createAdminClient();
  const { error } = await admin.from('tools_and_technology').insert({
    category,
    name,
    sort_order: sortOrder,
  });

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/tools-and-technology');
  return ok('Tool added.');
}

export async function updateToolsAndTechnology(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  const category = readString(formData, 'category');
  const name = readString(formData, 'name');
  const sortOrder = readInteger(formData, 'sortOrder');

  const missing = requireNonEmpty({ Id: id, Category: category, Name: name });
  if (missing) {
    return fail(missing);
  }

  if (sortOrder === null) {
    return fail('Display order must be a number.');
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('tools_and_technology')
    .update({ category, name, sort_order: sortOrder })
    .eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/tools-and-technology');
  return ok('Tool updated.');
}

export async function deleteToolsAndTechnology(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  if (!id) {
    return fail('Id is required.');
  }

  const admin = createAdminClient();
  const { error } = await admin.from('tools_and_technology').delete().eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/tools-and-technology');
  return ok('Tool deleted.');
}

export async function createFooterLink(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const columnKey = readString(formData, 'columnKey');
  const columnTitle = readString(formData, 'columnTitle');
  const label = readString(formData, 'label');
  const href = readString(formData, 'href');
  const sortOrder = readInteger(formData, 'sortOrder') ?? 0;
  const columnSortOrder = readInteger(formData, 'columnSortOrder') ?? 0;

  const missing = requireNonEmpty({
    'Column group': columnKey,
    'Column heading': columnTitle,
    'Link text': label,
    'Link URL': href,
  });

  if (missing) {
    return fail(missing);
  }

  const admin = createAdminClient();
  const { error } = await admin.from('footer_links').insert({
    column_key: columnKey,
    column_title: columnTitle,
    label,
    href,
    sort_order: sortOrder,
    column_sort_order: columnSortOrder,
  });

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/footer');
  return ok('Footer link added.');
}

export async function updateFooterLink(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  const columnKey = readString(formData, 'columnKey');
  const columnTitle = readString(formData, 'columnTitle');
  const label = readString(formData, 'label');
  const href = readString(formData, 'href');
  const sortOrder = readInteger(formData, 'sortOrder');
  const columnSortOrder = readInteger(formData, 'columnSortOrder');

  const missing = requireNonEmpty({
    Id: id,
    'Column group': columnKey,
    'Column heading': columnTitle,
    'Link text': label,
    'Link URL': href,
  });

  if (missing) {
    return fail(missing);
  }

  if (sortOrder === null || columnSortOrder === null) {
    return fail('Display order values must be numbers.');
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('footer_links')
    .update({
      column_key: columnKey,
      column_title: columnTitle,
      label,
      href,
      sort_order: sortOrder,
      column_sort_order: columnSortOrder,
    })
    .eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/footer');
  return ok('Footer link updated.');
}

export async function deleteFooterLink(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  if (!id) {
    return fail('Id is required.');
  }

  const admin = createAdminClient();
  const { error } = await admin.from('footer_links').delete().eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidateContent('/admin/footer');
  return ok('Footer link deleted.');
}

export async function deleteContactSubmission(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  if (!id) {
    return fail('Id is required.');
  }

  const admin = createAdminClient();
  const { error } = await admin.from('contact_submissions').delete().eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidatePath('/admin/contact');
  return ok('Contact submission deleted.');
}

export async function deleteContactRateLimitEvent(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = readString(formData, 'id');
  if (!id) {
    return fail('Id is required.');
  }

  const admin = createAdminClient();
  const { error } = await admin.from('contact_rate_limit_events').delete().eq('id', id);

  if (error) {
    return fail(error.message);
  }

  revalidatePath('/admin/contact');
  return ok('Rate limit event deleted.');
}
