import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseVideoEmbed,
  isVideoMedia,
  filterProjects,
  validateProjectInput,
  validateInquiryInput,
} from './portfolio.ts';
import type { Project } from '../types/portfolio.ts';

test('parseVideoEmbed extracts standard YouTube URLs', () => {
  const yt = parseVideoEmbed('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  assert.equal(yt.type, 'youtube');
  assert.ok(yt.embedUrl?.includes('dQw4w9WgXcQ'));
});

test('parseVideoEmbed extracts short youtu.be URLs', () => {
  const ytShort = parseVideoEmbed('https://youtu.be/dQw4w9WgXcQ');
  assert.equal(ytShort.type, 'youtube');
  assert.ok(ytShort.embedUrl?.includes('dQw4w9WgXcQ'));
});

test('parseVideoEmbed extracts Vimeo URLs', () => {
  const vimeo = parseVideoEmbed('https://vimeo.com/76979871');
  assert.equal(vimeo.type, 'vimeo');
  assert.ok(vimeo.embedUrl?.includes('76979871'));
});

test('parseVideoEmbed recognizes direct mp4/webm uploads', () => {
  const directMp4 = parseVideoEmbed('/uploads/scene1.mp4');
  assert.equal(directMp4.type, 'direct');
  assert.equal(directMp4.embedUrl, '/uploads/scene1.mp4');

  const upperMp4 = parseVideoEmbed('/uploads/scene2.MP4?token=123');
  assert.equal(upperMp4.type, 'direct');
});

test('isVideoMedia detects video URLs and files accurately', () => {
  assert.equal(isVideoMedia('/uploads/anim.mp4'), true);
  assert.equal(isVideoMedia('/uploads/anim.WEBM'), true);
  assert.equal(isVideoMedia('https://youtube.com/watch?v=12345678901'), true);
  assert.equal(isVideoMedia('/uploads/photo.png'), false);
  assert.equal(isVideoMedia(''), false);
});

test('filterProjects filters by category and sorts by order', () => {
  const mockProjects: Project[] = [
    {
      id: '1',
      title: 'Village River Scene',
      category: 'background-art',
      shortDescription: 'Bengali village river background',
      coverImage: '/bg1.png',
      galleryImages: [],
      softwareUsed: ['Adobe Animate CC'],
      order: 2,
      createdAt: '2026-01-01',
    },
    {
      id: '2',
      title: 'Fisherman Cartoon Character',
      category: 'character-design',
      shortDescription: 'Bengali rural character turnaround',
      coverImage: '/char1.png',
      galleryImages: [],
      softwareUsed: ['Adobe Animate CC', 'Photoshop'],
      order: 1,
      createdAt: '2026-01-02',
    },
    {
      id: '3',
      title: 'Monsoon Rain Short Animation',
      category: '2d-animation',
      shortDescription: '2D animated cartoon scene',
      coverImage: '/anim1.png',
      galleryImages: [],
      softwareUsed: ['Adobe Animate CC'],
      order: 3,
      createdAt: '2026-01-03',
    },
  ];

  // Category filter
  const bgOnly = filterProjects(mockProjects, 'background-art');
  assert.equal(bgOnly.length, 1);
  assert.equal(bgOnly[0].id, '1');

  // Search filter
  const searchResults = filterProjects(mockProjects, 'all', 'monsoon');
  assert.equal(searchResults.length, 1);
  assert.equal(searchResults[0].id, '3');

  // Software search
  const psResults = filterProjects(mockProjects, 'all', 'Photoshop');
  assert.equal(psResults.length, 1);
  assert.equal(psResults[0].id, '2');

  // Order check
  const allOrdered = filterProjects(mockProjects, 'all');
  assert.equal(allOrdered[0].order, 1);
  assert.equal(allOrdered[1].order, 2);
  assert.equal(allOrdered[2].order, 3);
});

test('validateProjectInput catches missing required fields', () => {
  const invalid = validateProjectInput({ title: '' });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.length >= 3);

  const valid = validateProjectInput({
    title: 'New Animation',
    category: '2d-animation',
    shortDescription: 'Short summary',
    coverImage: 'https://example.com/cover.png',
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.errors.length, 0);
});

test('validateInquiryInput checks email and message validity', () => {
  const invalidEmail = validateInquiryInput({
    name: 'Asif',
    email: 'bad-email',
    projectType: '2D Animation',
    message: 'Hello I want a cartoon video done',
  });
  assert.equal(invalidEmail.valid, false);

  const valid = validateInquiryInput({
    name: 'Jane Studio',
    email: 'jane@studio.com',
    projectType: '2D Animation',
    message: 'We are creating a children cartoon show and need 2D background art.',
  });
  assert.equal(valid.valid, true);
});
