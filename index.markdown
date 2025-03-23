---
layout: default
title: Atomic Tomorrow Adventures
---

# Welcome to Atomic Tomorrow Adventures

## Rules

{% for rule in site.pages %}
  {% if rule.path contains 'rules/' %}

- [{{ rule.title | default: rule.path | split: '/' | last | remove: '.md' }}]({{ site.baseurl }}{{ rule.url }})
  {% endif %}
{% endfor %}

## Setting

{% for setting in site.pages %}
  {% if setting.path contains 'setting/' %}

- [{{ setting.title | default: setting.path | split: '/' | last | remove: '.md' }}]({{ site.baseurl }}{{ setting.url }})
  {% endif %}
{% endfor %}

---
