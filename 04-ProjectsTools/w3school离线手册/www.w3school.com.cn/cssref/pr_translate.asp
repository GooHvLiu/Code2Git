

<!DOCTYPE html>
<html lang="zh-cn">

<!-- Mirrored from www.w3school.com.cn/cssref/pr_translate.asp by HTTrack Website Copier/3.x [XR&CO'2014], Fri, 20 Mar 2026 05:26:31 GMT -->
<!-- Added by HTTrack --><meta http-equiv="content-type" content="text/html;charset=utf-8" /><!-- /Added by HTTrack -->
<head>

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-878633-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-878633-1');
</script>

<meta charset="utf-8">
<meta name="robots" content="all" />
<meta name="author" content="w3school.com.cn" />

<link rel="stylesheet" type="text/css" href="../c17b30.css?v=4" />

<script src='../lib/cc/prism2.js'></script>
<link rel='stylesheet' href='../lib/cc/prism.css'>

<link rel="icon" type="image/png" sizes="16x16" href="../ui2019/logo-16-red.png">
<link rel="icon" type="image/png" sizes="32x32" href="../ui2019/logo-32-red.png">
<link rel="icon" type="image/png" sizes="48x48" href="../ui2019/logo-48-red.png">
<link rel="icon" type="image/png" sizes="96x96" href="../ui2019/logo-96-red.png">
<link rel="apple-touch-icon-precomposed" sizes="180x180" href="../ui2019/logo-180.png">


<title>CSS translate 属性</title>

</head>

<body class="html">

<div id="wrapper">

<div id="header">
<a id="logo" href="../index-2.html" title="w3school 在线教程" style="float:left;">w3school 在线教程</a>
<div id="header_gg">
<script async src="../../pagead2.googlesyndication.com/pagead/js/f.txt"></script>
<!-- W3 页眉 -->
<ins class="adsbygoogle"
     style="display:inline-block;width:728px;height:90px"
     data-ad-client="ca-pub-3381531532877742"
     data-ad-slot="7423315034"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
</div>
</div>

<div id="navfirst">
<ul id="menu">
<li id="h"><a href="../h.html" title="HTML 系列教程">HTML 系列教程</a></li>
<li id="b"><a href="../b.html" title="浏览器脚本教程">浏览器脚本</a></li>
<li id="s"><a href="../s.html" title="服务器脚本教程">服务器脚本</a></li>
<li id="p"><a href="../p.html" title="编程教程">编程教程</a></li>
<li id="x"><a href="../x.html" title="XML 系列教程">XML 系列教程</a></li>
<li id="w"><a href="../w.html" title="建站手册">建站手册</a></li>
<li id="r"><a href="../r.html" title="参考手册">参考手册</a></li>
</ul>
</div>

<div id="navsecond">

<div id="course"><h2>CSS 参考手册</h2>
<ul>
<li><a href="index.html" title="CSS 参考手册">CSS 参考手册</a></li>
<li><a href="css_browsersupport.html" title="CSS 浏览器支持参考手册">CSS 浏览器支持</a></li>
<li><a href="css_selectors.html" title="CSS 选择器参考手册">CSS 选择器</a></li>
<li><a href="css_ref_combinators.html" title="CSS 组合器参考手册">CSS 组合器</a></li>
<li><a href="css_ref_pseudo_classes.html" title="CSS 伪类参考手册">CSS 伪类</a></li>
<li><a href="css_ref_pseudo_elements.html" title="CSS 伪元素参考手册">CSS 伪元素</a></li>
<li><a href="css_functions.html" title="CSS 函数参考手册">CSS 函数</a></li>
<li><a href="css_animatable.html" title="CSS 动画相关属性">CSS 动画相关属性</a></li>
<li><a href="css_websafe_fonts.html" title="CSS 网络安全字体">CSS 网络安全字体</a></li>
<li><a href="css_fonts_fallbacks.html" title="CSS 字体回退">CSS 字体回退</a></li>
<li><a href="css_units.html" title="CSS 单位">CSS 单位</a></li>
<li><a href="css_colors.html" title="CSS 颜色">CSS 颜色</a></li>
<li><a href="css_colors_legal.html" title="CSS 颜色值">CSS 颜色值</a></li>
<li><a href="css_default_values.html" title="CSS 默认值">CSS 默认值</a></li>
<li><a href="css_entities.html" title="CSS 实体">CSS 实体</a></li>
<li><a href="css_ref_aural.html" title="CSS 听觉参考手册">CSS 听觉</a></li>
</ul>
<h2>CSS 属性</h2>
<ul>
<li><a href="pr_accent-color.html" title="CSS accent-color 属性">accent-color</a></li>
<li><a href="pr_align-content.html" title="CSS align-content 属性">align-content</a></li>
<li><a href="pr_align-items.html" title="CSS align-items 属性">align-items</a></li>
<li><a href="pr_align-self.html" title="CSS align-self 属性">align-self</a></li>
<li><a href="pr_all.html" title="CSS all 属性">all</a></li>
<li><a href="pr_animation.html" title="CSS animation 属性">animation</a></li>
<li><a href="pr_animation-delay.html" title="CSS animation-delay 属性">animation-delay</a></li>
<li><a href="pr_animation-direction.html" title="CSS animation-direction 属性">animation-direction</a></li>
<li><a href="pr_animation-duration.html" title="CSS animation-duration 属性">animation-duration</a></li>
<li><a href="pr_animation-fill-mode.html" title="CSS animation-fill-mode 属性">animation-fill-mode</a></li>
<li><a href="pr_animation-iteration-count.html" title="CSS animation-iteration-count 属性">animation-iteration-count</a></li>
<li><a href="pr_animation-name.html" title="CSS animation-name 属性">animation-name</a></li>
<li><a href="pr_animation-play-state.html" title="CSS animation-play-state 属性">animation-play-state</a></li>
<li><a href="pr_animation-timing-function.html" title="CSS animation-timing-function 属性">animation-timing-function</a></li>
<li><a href="pr_aspect-ratio.html" title="CSS aspect-ratio 属性">aspect-ratio</a></li>
<li><a href="pr_backdrop-filter.html" title="CSS backdrop-filter 属性">backdrop-filter</a></li>
<li><a href="pr_backface-visibility.html" title="CSS backface-visibility 属性">backface-visibility</a></li>
<li><a href="pr_background.html" title="CSS background 属性">background</a></li>
<li><a href="pr_background-attachment.html" title="CSS background-attachment 属性">background-attachment</a></li>
<li><a href="pr_background-blend-mode.html" title="CSS background-blend-mode 属性">background-blend-mode</a></li>
<li><a href="pr_background-clip.html" title="CSS background-clip 属性">background-clip</a></li>
<li><a href="pr_background-color.html" title="CSS background-color 属性">background-color</a></li>
<li><a href="pr_background-image.html" title="CSS background-image 属性">background-image</a></li>
<li><a href="pr_background-origin.html" title="CSS background-origin 属性">background-origin</a></li>
<li><a href="pr_background-position.html" title="CSS background-position 属性">background-position</a></li>
<li><a href="pr_background-position-x.html" title="CSS background-position-x 属性">background-position-x</a></li>
<li><a href="pr_background-position-y.html" title="CSS background-position-y 属性">background-position-y</a></li>
<li><a href="pr_background-repeat.html" title="CSS background-repeat 属性">background-repeat</a></li>
<li><a href="pr_background-size.html" title="CSS background-size 属性">background-size</a></li>
<li><a href="pr_block-size.html" title="CSS block-size 属性">block-size</a></li>
<li><a href="pr_border.html" title="CSS border 属性">border</a></li>
<li><a href="pr_border-block.html" title="CSS border-block 属性">border-block</a></li>
<li><a href="pr_border-block-color.html" title="CSS border-block-color 属性">border-block-color</a></li>
<li><a href="pr_border-block-end.html" title="CSS border-block-end 属性">border-block-end</a></li>
<li><a href="pr_border-block-end-color.html" title="CSS border-block-end-color 属性">border-block-end-color</a></li>
<li><a href="pr_border-block-end-style.html" title="CSS border-block-end-style 属性">border-block-end-style</a></li>
<li><a href="pr_border-block-end-width.html" title="CSS border-block-end-width 属性">border-block-end-width</a></li>
<li><a href="pr_border-block-start.html" title="CSS border-block-start 属性">border-block-start</a></li>
<li><a href="pr_border-block-start-color.html" title="CSS border-block-start-color 属性">border-block-start-color</a></li>
<li><a href="pr_border-block-start-style.html" title="CSS border-block-start-style 属性">border-block-start-style</a></li>
<li><a href="pr_border-block-start-width.html" title="CSS border-block-start-width 属性">border-block-start-width</a></li>
<li><a href="pr_border-block-style.html" title="CSS border-block-style 属性">border-block-style</a></li>
<li><a href="pr_border-block-width.html" title="CSS border-block-width 属性">border-block-width</a></li>
<li><a href="pr_border-bottom.html" title="CSS border-bottom 属性">border-bottom</a></li>
<li><a href="pr_border-bottom-color.html" title="CSS border-bottom-color 属性">border-bottom-color</a></li>
<li><a href="pr_border-bottom-left-radius.html" title="CSS border-bottom-left-radius 属性">border-bottom-left-radius</a></li>
<li><a href="pr_border-bottom-right-radius.html" title="CSS border-bottom-right-radius 属性">border-bottom-right-radius</a></li>
<li><a href="pr_border-bottom-style.html" title="CSS border-bottom-style 属性">border-bottom-style</a></li>
<li><a href="pr_border-bottom-width.html" title="CSS border-bottom-width 属性">border-bottom-width</a></li>
<li><a href="pr_border-collapse.html" title="CSS border-collapse 属性">border-collapse</a></li>
<li><a href="pr_border-color.html" title="CSS border-color 属性">border-color</a></li>
<li><a href="pr_border-end-end-radius.html" title="CSS border-end-end-radius 属性">border-end-end-radius</a></li>
<li><a href="pr_border-end-start-radius.html" title="CSS border-end-start-radius 属性">border-end-start-radius</a></li>
<li><a href="pr_border-image.html" title="CSS border-image 属性">border-image</a></li>
<li><a href="pr_border-image-outset.html" title="CSS border-image-outset 属性">border-image-outset</a></li>
<li><a href="pr_border-image-repeat.html" title="CSS border-image-repeat 属性">border-image-repeat</a></li>
<li><a href="pr_border-image-slice.html" title="CSS border-image-slice 属性">border-image-slice</a></li>
<li><a href="pr_border-image-source.html" title="CSS border-image-source 属性">border-image-source</a></li>
<li><a href="pr_border-image-width.html" title="CSS border-image-width 属性">border-image-width</a></li>
<li><a href="pr_border-inline.html" title="CSS border-inline 属性">border-inline</a></li>
<li><a href="pr_border-inline-color.html" title="CSS border-inline-color 属性">border-inline-color</a></li>
<li><a href="pr_border-inline-end.html" title="CSS border-inline-end 属性">border-inline-end</a></li>
<li><a href="pr_border-inline-end-color.html" title="CSS border-inline-end-color 属性">border-inline-end-color</a></li>
<li><a href="pr_border-inline-end-style.html" title="CSS border-inline-end-style 属性">border-inline-end-style</a></li>
<li><a href="pr_border-inline-end-width.html" title="CSS border-inline-end-width 属性">border-inline-end-width</a></li>
<li><a href="pr_border-inline-start.html" title="CSS border-inline-start 属性">border-inline-start</a></li>
<li><a href="pr_border-inline-start-color.html" title="CSS border-inline-start-color 属性">border-inline-start-color</a></li>
<li><a href="pr_border-inline-start-style.html" title="CSS border-inline-start-style 属性">border-inline-start-style</a></li>
<li><a href="pr_border-inline-start-width.html" title="CSS border-inline-start-width 属性">border-inline-start-width</a></li>
<li><a href="pr_border-inline-style.html" title="CSS border-inline-style 属性">border-inline-style</a></li>
<li><a href="pr_border-inline-width.html" title="CSS border-inline-width 属性">border-inline-width</a></li>
<li><a href="pr_border-left.html" title="CSS border-left 属性">border-left</a></li>
<li><a href="pr_border-left-color.html" title="CSS border-left-color 属性">border-left-color</a></li>
<li><a href="pr_border-left-style.html" title="CSS border-left-style 属性">border-left-style</a></li>
<li><a href="pr_border-left-width.html" title="CSS border-left-width 属性">border-left-width</a></li>
<li><a href="pr_border-radius.html" title="CSS border-radius 属性">border-radius</a></li>
<li><a href="pr_border-right.html" title="CSS border-right 属性">border-right</a></li>
<li><a href="pr_border-right-color.html" title="CSS border-right-color 属性">border-right-color</a></li>
<li><a href="pr_border-right-style.html" title="CSS border-right-style 属性">border-right-style</a></li>
<li><a href="pr_border-right-width.html" title="CSS border-right-width 属性">border-right-width</a></li>
<li><a href="pr_border-spacing.html" title="CSS border-spacing 属性">border-spacing</a></li>
<li><a href="pr_border-start-end-radius.html" title="CSS border-start-end-radius 属性">border-start-end-radius</a></li>
<li><a href="pr_border-start-start-radius.html" title="CSS border-start-start-radius 属性">border-start-start-radius</a></li>
<li><a href="pr_border-style.html" title="CSS border-style 属性">border-style</a></li>
<li><a href="pr_border-top.html" title="CSS border-top 属性">border-top</a></li>
<li><a href="pr_border-top-color.html" title="CSS border-top-color 属性">border-top-color</a></li>
<li><a href="pr_border-top-left-radius.html" title="CSS border-top-left-radius 属性">border-top-left-radius</a></li>
<li><a href="pr_border-top-right-radius.html" title="CSS border-top-right-radius 属性">border-top-right-radius</a></li>
<li><a href="pr_border-top-style.html" title="CSS border-top-style 属性">border-top-style</a></li>
<li><a href="pr_border-top-width.html" title="CSS border-top-width 属性">border-top-width</a></li>
<li><a href="pr_border-width.html" title="CSS border-width 属性">border-width</a></li>
<li><a href="pr_pos_bottom.html" title="CSS bottom 属性">bottom</a></li>
<li><a href="pr_box-decoration-break.html" title="CSS box-decoration-break 属性">box-decoration-break</a></li>
<li><a href="pr_box-reflect.html" title="CSS box-reflect 属性">box-reflect</a></li>
<li><a href="pr_box-shadow.html" title="CSS box-shadow 属性">box-shadow</a></li>
<li><a href="pr_box-sizing.html" title="CSS box-sizing 属性">box-sizing</a></li>
<li><a href="pr_break-after.html" title="CSS break-after 属性">break-after</a></li>
<li><a href="pr_break-before.html" title="CSS break-before 属性">break-before</a></li>
<li><a href="pr_break-inside.html" title="CSS break-inside 属性">break-inside</a></li>
<li><a href="pr_tab_caption-side.html" title="CSS caption-side 属性">caption-side</a></li>
<li><a href="pr_caret-color.html" title="CSS caret-color 属性">caret-color</a></li>
<li><a href="pr_charset_rule.html" title="CSS @charset 属性">@charset</a></li>
<li><a href="pr_class_clear.html" title="CSS clear 属性">clear</a></li>
<li><a href="pr_pos_clip.html" title="CSS clip 属性">clip</a></li>
<li><a href="pr_clip-path.html" title="CSS clip-path 属性">clip-path</a></li>
<li><a href="pr_text_color.html" title="CSS color 属性">color</a></li>
<li><a href="pr_color-scheme.html" title="CSS color-scheme 属性">color-scheme</a></li>
<li><a href="pr_column-count.html" title="CSS column-count 属性">column-count</a></li>
<li><a href="pr_column-fill.html" title="CSS column-fill 属性">column-fill</a></li>
<li><a href="pr_column-gap.html" title="CSS column-gap 属性">column-gap</a></li>
<li><a href="pr_column-rule.html" title="CSS column-rule 属性">column-rule</a></li>
<li><a href="pr_column-rule-color.html" title="CSS column-rule-color 属性">column-rule-color</a></li>
<li><a href="pr_column-rule-style.html" title="CSS column-rule-style 属性">column-rule-style</a></li>
<li><a href="pr_column-rule-width.html" title="CSS column-rule-width 属性">column-rule-width</a></li>
<li><a href="pr_column-span.html" title="CSS column-span 属性">column-span</a></li>
<li><a href="pr_column-width.html" title="CSS column-width 属性">column-width</a></li>
<li><a href="pr_columns.html" title="CSS columns 属性">columns</a></li>
<li><a href="atrule_container.html" title="CSS @container 规则">@container</a></li>
<li><a href="pr_gen_content.html" title="CSS content 属性">content</a></li>
<li><a href="pr_gen_counter-increment.html" title="CSS counter-increment 属性">counter-increment</a></li>
<li><a href="pr_gen_counter-reset.html" title="CSS counter-reset 属性">counter-reset</a></li>
<li><a href="pr_gen_counter-set.html" title="CSS counter-set 属性">counter-set</a></li>
<li><a href="atrule_counter-style.html" title="CSS @counter-style Rule">@counter-style</a></li>
<li><a href="pr_class_cursor.html" title="CSS cursor 属性">cursor</a></li>
<li><a href="pr_text_direction.html" title="CSS direction 属性">direction</a></li>
<li><a href="pr_class_display.html" title="CSS display 属性">display</a></li>
<li><a href="pr_tab_empty-cells.html" title="CSS empty-cells 属性">empty-cells</a></li>
<li><a href="pr_filter.html" title="CSS filter 属性">filter</a></li>
<li><a href="pr_flex.html" title="CSS flex 属性">flex</a></li>
<li><a href="pr_flex-basis.html" title="CSS flex-basis 属性">flex-basis</a></li>
<li><a href="pr_flex-direction.html" title="CSS flex-direction 属性">flex-direction</a></li>
<li><a href="pr_flex-flow.html" title="CSS flex-flow 属性">flex-flow</a></li>
<li><a href="pr_flex-grow.html" title="CSS flex-grow 属性">flex-grow</a></li>
<li><a href="pr_flex-shrink.html" title="CSS flex-shrink 属性">flex-shrink</a></li>
<li><a href="pr_flex-wrap.html" title="CSS flex-wrap 属性">flex-wrap</a></li>
<li><a href="pr_class_float.html" title="CSS float 属性">float</a></li>
<li><a href="pr_font_font.html" title="CSS font 属性">font</a></li>
<li><a href="atrule_font-face.html" title="CSS @font-face 属性">@font-face</a></li>
<li><a href="pr_font_font-family.html" title="CSS font-family 属性">font-family</a></li>
<li><a href="pr_font-feature-settings.html" title="CSS font-feature-settings 属性">font-feature-settings</a></li>
<li><a href="pr_font-kerning.html" title="CSS font-kerning 属性">font-kerning</a></li>
<li><a href="atrule_font-palette-values.html" title="CSS @font-palette-values 规则">@font-palette-values</a></li>
<li><a href="pr_font_font-size.html" title="CSS font-size 属性">font-size</a></li>
<li><a href="pr_font-size-adjust.html" title="CSS font-size-adjust 属性">font-size-adjust</a></li>
<li><a href="pr_font-stretch.html" title="CSS font-stretch 属性">font-stretch</a></li>
<li><a href="pr_font_font-style.html" title="CSS font-style 属性">font-style</a></li>
<li><a href="pr_font_font-variant.html" title="CSS font-variant 属性">font-variant</a></li>
<li><a href="pr_font-variant-caps.html" title="CSS font-variant-caps 属性">font-variant-caps</a></li>
<li><a href="pr_font-weight.html" title="CSS font-weight 属性">font-weight</a></li>
<li><a href="pr_gap.html" title="CSS gap 属性">gap</a></li>
<li><a href="pr_grid.html" title="CSS grid 属性">grid</a></li>
<li><a href="pr_grid-area.html" title="CSS grid-area 属性">grid-area</a></li>
<li><a href="pr_grid-auto-columns.html" title="CSS grid-auto-columns 属性">grid-auto-columns</a></li>
<li><a href="pr_grid-auto-flow.html" title="CSS grid-auto-flow 属性">grid-auto-flow</a></li>
<li><a href="pr_grid-auto-rows.html" title="CSS grid-auto-rows 属性">grid-auto-rows</a></li>
<li><a href="pr_grid-column.html" title="CSS grid-column 属性">grid-column</a></li>
<li><a href="pr_grid-column-end.html" title="CSS grid-column-end 属性">grid-column-end</a></li>
<li><a href="pr_grid-column-gap.html" title="CSS grid-column-gap 属性">grid-column-gap</a></li>
<li><a href="pr_grid-column-start.html" title="CSS grid-column-start 属性">grid-column-start</a></li>
<li><a href="pr_grid-gap.html" title="CSS grid-gap 属性">grid-gap</a></li>
<li><a href="pr_grid-row.html" title="CSS grid-row 属性">grid-row</a></li>
<li><a href="pr_grid-row-end.html" title="CSS grid-row-end 属性">grid-row-end</a></li>
<li><a href="pr_grid-row-gap.html" title="CSS grid-row-gap 属性">grid-row-gap</a></li>
<li><a href="pr_grid-row-start.html" title="CSS grid-row-start 属性">grid-row-start</a></li>
<li><a href="pr_grid-template.html" title="CSS grid-template 属性">grid-template</a></li>
<li><a href="pr_grid-template-areas.html" title="CSS grid-template-areas 属性">grid-template-areas</a></li>
<li><a href="pr_grid-template-columns.html" title="CSS grid-template-columns 属性">grid-template-columns</a></li>
<li><a href="pr_grid-template-rows.html" title="CSS grid-template-rows 属性">grid-template-rows</a></li>
<li><a href="pr_hanging-punctuation.html" title="CSS hanging-punctuation 属性">hanging-punctuation</a></li>
<li><a href="pr_dim_height.html" title="CSS height 属性">height</a></li>
<li><a href="pr_hyphens.html" title="CSS hyphens 属性">hyphens</a></li>
<li><a href="pr_hyphenate-character.html" title="CSS hyphenate-character 属性">hyphenate-character</a></li>
<li><a href="pr_image-rendering.html" title="CSS image-rendering 属性">image-rendering</a></li>
<li><a href="atrule_import.html" title="CSS @import 属性">@import</a></li>
<li><a href="pr_initial-letter.html" title="CSS initial-letter 属性">initial-letter</a></li>
<li><a href="pr_inline-size.html" title="CSS inline-size 属性">inline-size</a></li>
<li><a href="pr_inset.html" title="CSS inset 属性">inset</a></li>
<li><a href="pr_inset-block.html" title="CSS inset-block 属性">inset-block</a></li>
<li><a href="pr_inset-block-end.html" title="CSS inset-block-end 属性">inset-block-end</a></li>
<li><a href="pr_inset-block-start.html" title="CSS inset-block-start 属性">inset-block-start</a></li>
<li><a href="pr_inset-inline.html" title="CSS inset-inline 属性">inset-inline</a></li>
<li><a href="pr_inset-inline-end.html" title="CSS inset-inline-end 属性">inset-inline-end</a></li>
<li><a href="pr_inset-inline-start.html" title="CSS inset-inline-start 属性">inset-inline-start</a></li>
<li><a href="pr_isolation.html" title="CSS isolation 属性">isolation</a></li>
<li><a href="pr_justify-content.html" title="CSS justify-content 属性">justify-content</a></li>
<li><a href="pr_justify-items.html" title="CSS justify-items 属性">justify-items</a></li>
<li><a href="pr_justify-self.html" title="CSS justify-self 属性">justify-self</a></li>
<li><a href="pr_keyframes.html" title="CSS @keyframes 规则">@keyframes</a></li>
<li><a href="atrule_layer.html" title="CSS @layer 规则">@layer</a></li>
<li><a href="pr_pos_left.html" title="CSS left 属性">left</a></li>
<li><a href="pr_text_letter-spacing.html" title="CSS letter-spacing 属性">letter-spacing</a></li>
<li><a href="pr_dim_line-height.html" title="CSS line-height 属性">line-height</a></li>
<li><a href="pr_list-style.html" title="CSS list-style 属性">list-style</a></li>
<li><a href="pr_list-style-image.html" title="CSS list-style-image 属性">list-style-image</a></li>
<li><a href="pr_list-style-position.html" title="CSS list-style-position 属性">list-style-position</a></li>
<li><a href="pr_list-style-type.html" title="CSS list-style-type 属性">list-style-type</a></li>
<li><a href="pr_margin.html" title="CSS margin 属性">margin</a></li>
<li><a href="pr_margin-block.html" title="CSS margin-block 属性">margin-block</a></li>
<li><a href="pr_margin-block-end.html" title="CSS margin-block-end 属性">margin-block-end</a></li>
<li><a href="pr_margin-block-start.html" title="CSS margin-block-start 属性">margin-block-start</a></li>
<li><a href="pr_margin-bottom.html" title="CSS margin-bottom 属性">margin-bottom</a></li>
<li><a href="pr_margin-inline.html" title="CSS margin-inline 属性">margin-inline</a></li>
<li><a href="pr_margin-inline-end.html" title="CSS margin-inline-end 属性">margin-inline-end</a></li>
<li><a href="pr_margin-inline-start.html" title="CSS margin-inline-start 属性">margin-inline-start</a></li>
<li><a href="pr_margin-left.html" title="CSS margin-left 属性">margin-left</a></li>
<li><a href="pr_margin-right.html" title="CSS margin-right 属性">margin-right</a></li>
<li><a href="pr_margin-top.html" title="CSS margin-top 属性">margin-top</a></li>
<li><a href="pr_marker.html" title="CSS marker 属性">marker</a></li>
<li><a href="pr_marker-end.html" title="CSS marker-end 属性">marker-end</a></li>
<li><a href="pr_marker-mid.html" title="CSS marker-mid 属性">marker-mid</a></li>
<li><a href="pr_marker-start.html" title="CSS marker-start 属性">marker-start</a></li>
<li><a href="pr_mask.html" title="CSS mask 属性">mask</a></li>
<li><a href="pr_mask-clip.html" title="CSS mask-clip 属性">mask-clip</a></li>
<li><a href="pr_mask-composite.html" title="CSS mask-composite 属性">mask-composite</a></li>
<li><a href="pr_mask-image.html" title="CSS mask-image 属性">mask-image</a></li>
<li><a href="pr_mask-mode.html" title="CSS mask-mode 属性">mask-mode</a></li>
<li><a href="pr_mask-origin.html" title="CSS mask-origin 属性">mask-origin</a></li>
<li><a href="pr_mask-position.html" title="CSS mask-position 属性">mask-position</a></li>
<li><a href="pr_mask-repeat.html" title="CSS mask-repeat 属性">mask-repeat</a></li>
<li><a href="pr_mask-size.html" title="CSS mask-size 属性">mask-size</a></li>
<li><a href="pr_mask-type.html" title="CSS mask-type 属性">mask-type</a></li>
<li><a href="pr_max-block-size.html" title="CSS max-block-size 属性">max-block-size</a></li>
<li><a href="pr_dim_max-height.html" title="CSS max-height 属性">max-height</a></li>
<li><a href="pr_max-inline-size.html" title="CSS max-inline-size 属性">max-inline-size</a></li>
<li><a href="pr_dim_max-width.html" title="CSS max-width 属性">max-width</a></li>
<li><a href="pr_mediaquery.html" title="CSS @media 属性">@media</a></li>
<li><a href="pr_min-block-size.html" title="CSS min-block-size 属性">min-block-size</a></li>
<li><a href="pr_min-inline-size.html" title="CSS min-inline-size 属性">min-inline-size</a></li>
<li><a href="pr_dim_min-height.html" title="CSS min-height 属性">min-height</a></li>
<li><a href="pr_dim_min-width.html" title="CSS min-width 属性">min-width</a></li>
<li><a href="pr_mix-blend-mode.html" title="CSS mix-blend-mode 属性">mix-blend-mode</a></li>
<li><a href="atrule_namespace.html" title="CSS @namespace 规则">@namespace</a></li>
<li><a href="pr_object-fit.html" title="CSS object-fit 属性">object-fit</a></li>
<li><a href="pr_object-position.html" title="CSS object-position 属性">object-position</a></li>
<li><a href="pr_offset.html" title="CSS offset 属性">offset</a></li>
<li><a href="pr_offset-anchor.html" title="CSS offset-anchor 属性">offset-anchor</a></li>
<li><a href="pr_offset-distance.html" title="CSS offset-distance 属性">offset-distance</a></li>
<li><a href="pr_offset-path.html" title="CSS offset-path 属性">offset-path</a></li>
<li><a href="pr_offset-position.html" title="CSS offset-position 属性">offset-position</a></li>
<li><a href="pr_offset-rotate.html" title="CSS offset-rotate 属性">offset-rotate</a></li>
<li><a href="pr_opacity.html" title="CSS opacity 属性">opacity</a></li>
<li><a href="pr_order.html" title="CSS order 属性">order</a></li>
<li><a href="pr_orphans.html" title="CSS orphans 属性">orphans</a></li>
<li><a href="pr_outline.html" title="CSS outline 属性">outline</a></li>
<li><a href="pr_outline-color.html" title="CSS outline-color 属性">outline-color</a></li>
<li><a href="pr_outline-offset.html" title="CSS outline-offset 属性">outline-offset</a></li>
<li><a href="pr_outline-style.html" title="CSS outline-style 属性">outline-style</a></li>
<li><a href="pr_outline-width.html" title="CSS outline-width 属性">outline-width</a></li>
<li><a href="pr_pos_overflow.html" title="CSS overflow 属性">overflow</a></li>
<li><a href="pr_overflow-anchor.html" title="CSS overflow-anchor 属性">overflow-anchor</a></li>
<li><a href="pr_overflow-wrap.html" title="CSS overflow-wrap 属性">overflow-wrap</a></li>
<li><a href="pr_overflow-x.html" title="CSS overflow-x 属性">overflow-x</a></li>
<li><a href="pr_overflow-y.html" title="CSS overflow-y 属性">overflow-y</a></li>
<li><a href="pr_overscroll-behavior.html" title="CSS overscroll-behavior 属性">overscroll-behavior</a></li>
<li><a href="pr_overscroll-behavior-block.html" title="CSS overscroll-behavior-block 属性">overscroll-behavior-block</a></li>
<li><a href="pr_overscroll-behavior-inline.html" title="CSS overscroll-behavior-inline 属性">overscroll-behavior-inline</a></li>
<li><a href="pr_overscroll-behavior-x.html" title="CSS overscroll-behavior-x 属性">overscroll-behavior-x</a></li>
<li><a href="pr_overscroll-behavior-y.html" title="CSS overscroll-behavior-y 属性">overscroll-behavior-y</a></li>
<li><a href="pr_padding.html" title="CSS padding 属性">padding</a></li>
<li><a href="pr_padding-block.html" title="CSS padding-block 属性">padding-block</a></li>
<li><a href="pr_padding-block-end.html" title="CSS padding-block-end 属性">padding-block-end</a></li>
<li><a href="pr_padding-block-start.html" title="CSS padding-block-start 属性">padding-block-start</a></li>
<li><a href="pr_padding-bottom.html" title="CSS padding-bottom 属性">padding-bottom</a></li>
<li><a href="pr_padding-inline.html" title="CSS padding-inline 属性">padding-inline</a></li>
<li><a href="pr_padding-inline-end.html" title="CSS padding-inline-end 属性">padding-inline-end</a></li>
<li><a href="pr_padding-inline-start.html" title="CSS padding-inline-start 属性">padding-inline-start</a></li>
<li><a href="pr_padding-left.html" title="CSS padding-left 属性">padding-left</a></li>
<li><a href="pr_padding-right.html" title="CSS padding-right 属性">padding-right</a></li>
<li><a href="pr_padding-top.html" title="CSS padding-top 属性">padding-top</a></li>
<li><a href="atrule_page.html" title="CSS @page 规则">@page</a></li>
<li><a href="pr_page-break-after.html" title="CSS page-break-after 属性">page-break-after</a></li>
<li><a href="pr_page-break-before.html" title="CSS page-break-before 属性">page-break-before</a></li>
<li><a href="pr_page-break-inside.html" title="CSS page-break-inside 属性">page-break-inside</a></li>
<li><a href="pr_paint-order.html" title="CSS paint-order 属性">paint-order</a></li>
<li><a href="pr_perspective.html" title="CSS perspective 属性">perspective</a></li>
<li><a href="pr_perspective-origin.html" title="CSS perspective-origin 属性">perspective-origin</a></li>
<li><a href="pr_place-content.html" title="CSS place-content 属性">place-content</a></li>
<li><a href="pr_place-items.html" title="CSS place-items 属性">place-items</a></li>
<li><a href="pr_place-self.html" title="CSS place-self 属性">place-self</a></li>
<li><a href="pr_pointer-events.html" title="CSS pointer-events 属性">pointer-events</a></li>
<li><a href="pr_class_position.html" title="CSS position 属性">position</a></li>
<li><a href="atrule_property.html" title="CSS @property 规则">@property</a></li>
<li><a href="pr_gen_quotes.html" title="CSS quotes 属性">quotes</a></li>
<li><a href="pr_resize.html" title="CSS resize 属性">resize</a></li>
<li><a href="pr_pos_right.html" title="CSS right 属性">right</a></li>
<li><a href="pr_rotate.html" title="CSS rotate 属性">rotate</a></li>
<li><a href="pr_row-gap.html" title="CSS row-gap 属性">row-gap</a></li>
<li><a href="pr_scale.html" title="CSS scale 属性">scale</a></li>
<li><a href="atrule_scope.html" title="CSS @scope 规则">@scope</a></li>
<li><a href="pr_scroll-behavior.html" title="CSS scroll-behavior 属性">scroll-behavior</a></li>
<li><a href="pr_scroll-margin.html" title="CSS scroll-margin 属性">scroll-margin</a></li>
<li><a href="pr_scroll-margin-block.html" title="CSS scroll-margin-block 属性">scroll-margin-block</a></li>
<li><a href="pr_scroll-margin-block-end.html" title="CSS scroll-margin-block-end 属性">scroll-margin-block-end</a></li>
<li><a href="pr_scroll-margin-block-start.html" title="CSS scroll-margin-block-start 属性">scroll-margin-block-start</a></li>
<li><a href="pr_scroll-margin-bottom.html" title="CSS scroll-margin-bottom 属性">scroll-margin-bottom</a></li>
<li><a href="pr_scroll-margin-inline.html" title="CSS scroll-margin-inline 属性">scroll-margin-inline</a></li>
<li><a href="pr_scroll-margin-inline-end.html" title="CSS scroll-margin-inline-end 属性">scroll-margin-inline-end</a></li>
<li><a href="pr_scroll-margin-inline-start.html" title="CSS scroll-margin-inline-start 属性">scroll-margin-inline-start</a></li>
<li><a href="pr_scroll-margin-left.html" title="CSS scroll-margin-left 属性">scroll-margin-left</a></li>
<li><a href="pr_scroll-margin-right.html" title="CSS scroll-margin-right 属性">scroll-margin-right</a></li>
<li><a href="pr_scroll-margin-top.html" title="CSS scroll-margin-top 属性">scroll-margin-top</a></li>
<li><a href="pr_scroll-padding.html" title="CSS scroll-padding 属性">scroll-padding</a></li>
<li><a href="pr_scroll-padding-block.html" title="CSS scroll-padding-block 属性">scroll-padding-block</a></li>
<li><a href="pr_scroll-padding-block-end.html" title="CSS scroll-padding-block-end 属性">scroll-padding-block-end</a></li>
<li><a href="pr_scroll-padding-block-start.html" title="CSS scroll-padding-block-start 属性">scroll-padding-block-start</a></li>
<li><a href="pr_scroll-padding-bottom.html" title="CSS scroll-padding-bottom 属性">scroll-padding-bottom</a></li>
<li><a href="pr_scroll-padding-inline.html" title="CSS scroll-padding-inline 属性">scroll-padding-inline</a></li>
<li><a href="pr_scroll-padding-inline-end.html" title="CSS scroll-padding-inline-end 属性">scroll-padding-inline-end</a></li>
<li><a href="pr_scroll-padding-inline-start.html" title="CSS scroll-padding-inline-start 属性">scroll-padding-inline-start</a></li>
<li><a href="pr_scroll-padding-left.html" title="CSS scroll-padding-left 属性">scroll-padding-left</a></li>
<li><a href="pr_scroll-padding-right.html" title="CSS scroll-padding-right 属性">scroll-padding-right</a></li>
<li><a href="pr_scroll-padding-top.html" title="CSS scroll-padding-top 属性">scroll-padding-top</a></li>
<li><a href="pr_scroll-snap-align.html" title="CSS scroll-snap-align 属性">scroll-snap-align</a></li>
<li><a href="pr_scroll-snap-stop.html" title="CSS scroll-snap-stop 属性">scroll-snap-stop</a></li>
<li><a href="pr_scroll-snap-type.html" title="CSS scroll-snap-type 属性">scroll-snap-type</a></li>
<li><a href="pr_scrollbar-color.html" title="CSS scrollbar-color 属性">scrollbar-color</a></li>
<li><a href="pr_shape-outside.html" title="CSS shape-outside 属性">shape-outside</a></li>
<li><a href="atrule_starting-style.html" title="CSS @starting-style 规则">@starting-style</a></li>
<li><a href="atrule_supports.html" title="CSS @supports 规则">@supports</a></li>
<li><a href="pr_tab-size.html" title="CSS tab-size 属性">tab-size</a></li>
<li><a href="pr_tab_table-layout.html" title="CSS table-layout 属性">table-layout</a></li>
<li><a href="pr_text_text-align.html" title="CSS text-align 属性">text-align</a></li>
<li><a href="pr_text-align-last.html" title="CSS text-align-last 属性">text-align-last</a></li>
<li><a href="pr_text_text-decoration.html" title="CSS text-decoration 属性">text-decoration</a></li>
<li><a href="pr_text-decoration-color.html" title="CSS text-decoration-color 属性">text-decoration-color</a></li>
<li><a href="pr_text-decoration-line.html" title="CSS text-decoration-line 属性">text-decoration-line</a></li>
<li><a href="pr_text-decoration-style.html" title="CSS text-decoration-style 属性">text-decoration-style</a></li>
<li><a href="pr_text_text-decoration-thickness.html" title="CSS text-decoration-thickness 属性">text-decoration-thickness</a></li>
<li><a href="pr_text-emphasis.html" title="CSS text-emphasis 属性">text-emphasis</a></li>
<li><a href="pr_text-emphasis-color.html" title="CSS text-emphasis-color 属性">text-emphasis-color</a></li>
<li><a href="pr_text-emphasis-position.html" title="CSS text-emphasis-position 属性">text-emphasis-position</a></li>
<li><a href="pr_text-emphasis-style.html" title="CSS text-emphasis-style 属性">text-emphasis-style</a></li>
<li><a href="pr_text_text-indent.html" title="CSS text-indent 属性">text-indent</a></li>
<li><a href="pr_text-justify.html" title="CSS text-justify 属性">text-justify</a></li>
<li><a href="pr_text-orientation.html" title="CSS text-orientation 属性">text-orientation</a></li>
<li><a href="pr_text-overflow.html" title="CSS text-overflow 属性">text-overflow</a></li>
<li><a href="pr_text-shadow.html" title="CSS text-shadow 属性">text-shadow</a></li>
<li><a href="pr_text_text-transform.html" title="CSS text-transform 属性">text-transform</a></li>
<li><a href="pr_text-underline-offset.html" title="CSS text-underline-offset 属性">text-underline-offset</a></li>
<li><a href="pr_text-underline-position.html" title="CSS text-underline-position 属性">text-underline-position</a></li>
<li><a href="pr_pos_top.html" title="CSS top 属性">top</a></li>
<li><a href="pr_transform.html" title="CSS transform 属性">transform</a></li>
<li><a href="pr_transform-origin.html" title="CSS transform-origin 属性">transform-origin</a></li>
<li><a href="pr_transform-style.html" title="CSS transform-style 属性">transform-style</a></li>
<li><a href="pr_transition.html" title="CSS transition 属性">transition</a></li>
<li><a href="pr_transition-delay.asp" title="CSS transition-delay 属性">transition-delay</a></li>
<li><a href="pr_transition-duration.asp" title="CSS transition-duration 属性">transition-duration</a></li>
<li><a href="pr_transition-property.asp" title="CSS transition-property 属性">transition-property</a></li>
<li><a href="pr_transition-timing-function.asp" title="CSS transition-timing-function 属性">transition-timing-function</a></li>
<li class="currentLink"><a href="pr_translate.asp" title="CSS translate 属性">translate</a></li>
<li><a href="pr_unicode-bidi.asp" title="CSS unicode-bidi 属性">unicode-bidi</a></li>
<li><a href="pr_user-select.asp" title="CSS user-select 属性">user-select</a></li>
<li><a href="pr_pos_vertical-align.asp" title="CSS vertical-align 属性">vertical-align</a></li>
<li><a href="pr_class_visibility.asp" title="CSS visibility 属性">visibility</a></li>
<li><a href="pr_text_white-space.asp" title="CSS white-space 属性">white-space</a></li>
<li><a href="pr_widows.asp" title="CSS widows 属性">widows</a></li>
<li><a href="pr_dim_width.asp" title="CSS width 属性">width</a></li>
<li><a href="pr_word-break.asp" title="CSS word-break 属性">word-break</a></li>
<li><a href="pr_text_word-spacing.asp" title="CSS word-spacing 属性">word-spacing</a></li>
<li><a href="pr_word-wrap.asp" title="CSS word-wrap 属性">word-wrap</a></li>
<li><a href="pr_writing-mode.asp" title="CSS writing-mode 属性">writing-mode</a></li>
<li><a href="pr_pos_z-index.html" title="z-index">z-index</a></li>
<li><a href="pr_zoom.html" title="CSS zoom 属性">zoom</a></li>
</ul>
</div><div id="selected">
<h2>课程推荐：</h2>
<ul>
<li><a href="../howto/index.html" title="W3School 百宝箱">W3School 百宝箱</a></li>
<li><a href="../java/index.html" title="Java 教程">Java 教程</a></li>
<li><a href="../c/index.html" title="C 教程">C</a></li>
<li><a href="../cpp/index.html" title="C++ 教程">C++</a></li>
</ul>

</div>

</div>

<div id="maincontent">

<h1>CSS translate 属性</h1>

<div class="prenextnav">
<ul class="prenext">
<li class="pre"><a href="pr_transition-timing-function.asp" title="CSS transition-timing-function 属性">transition-timing-function</a></li>
<li class="next"><a href="pr_unicode-bidi.asp" title="CSS unicode-bidi 属性">unicode-bidi</a></li>
</ul>
</div>



<section>
<h2>定义和用法</h2>

<p><code>translate</code> 属性允许您更改元素的位置。</p>

<p><code>translate</code> 属性定义了元素在二维空间中的 x 轴和 y 轴坐标。您还可以定义 z 轴坐标以在三维空间中更改位置。</p>

<p>坐标可以仅给出 x 轴坐标、x 轴和 y 轴坐标，或者 x 轴、y 轴和 z 轴坐标。</p>

<p>为了更好地理解 <code>translate</code> 属性，请查看<a href="../demo/cssref/translate_inuse.html">演示</a>。</p>

<p class="tip"><span>提示：</span>要使 z 轴属性生效，您需要为 CSS perspective 属性定义一个值。</p>

<p class="note"><span>注意：</span>另一种平移元素的技术是使用带有 <a href="func_translate-2.html" title="CSS translate() 函数">CSS translate() 函数</a> 的 CSS transform 属性。本页的 CSS translate 属性可以说是一种更简单、更直接的方法来平移元素。</p>
</section>



<section>
<h2>实例</h2>

<h3>例子 1</h3>

<p>更改元素的位置：</p>

<pre class="language-css">
div {
  translate: 100px 20px;
}
</pre>

<p class="tiy"><a target="_blank" href="../tiy/tae5a.html?f=cssref_translate">亲自试一试</a></p>

<h3>例子 2</h3>

<p>当设置 z 轴的 <code>translate</code> 属性时，必须在父元素上也设置 <code>perspective</code> 属性，我们才能看到任何效果：</p>

<pre class="language-css">
DIV1 {
  perspective: 200px;
}

DIV2 {
  translate: 50px 50px 50px;
}
</pre>

<p class="tiy"><a target="_blank" href="../tiy/te937-2.html?f=cssref_translate_with_z-axis">亲自试一试</a></p>
</section>



<section>
<h2>CSS 语法</h2>

<pre class="language-css">
translate: <i>x-axis</i> <i>y-axis</i> <i>z-axis</i>|initial|inherit;
</pre>

<h3>属性值</h3>

<table class="property-value">
<tr>
<th style="width: 25%;">值</th>
<th>描述</th>
</tr>

<tr>
<td><i>x-axis</i></td>
<td>
	<p>定义在 x 轴上的位置。可能的值：</p>

	<ul class="listintable">
	<li>长度</li>
	<li>百分比</li>
	</ul>
</td>
</tr>

<tr>
<td><i>y-axis</i></td>
<td>
	<p>定义在 y 轴上的位置。可能的值：</p>

	<ul class="listintable">
	<li>长度</li>
	<li>百分比</li>
	</ul>
</td>
</tr>

<tr>
<td><i>z-axis</i></td>
<td>
	<p>定义在 z 轴上的位置。可能的值：</p>

	<ul class="listintable">
	<li>长度</li>
	<li>百分比</li>
	</ul>
</td>
</tr>

<tr>
<td>initial</td>
<td>将此属性设置为其默认值。参阅 <a href="css_initial.html" title="CSS initial 关键字">initial</a>。</td>
</tr>

<tr>
<td>inherit</td>
<td>从其父元素继承此属性。参阅 <a href="css_inherit.html" title="CSS inherit 关键字">inherit</a>。</td>
</tr>	
</table>
</section>



<section>
<h2>技术细节</h2>

<table class="technical-details">
<tr>
<th style="width: 25%;">默认值：</th>
<td>none</td>
</tr>

<tr>
<th>继承性：</th>
<td>否</td>
</tr>

<tr>
<th>动画制作：</th>
<td>支持。请参阅：<a href="css_animatable.html" title="CSS 动画相关属性">动画相关属性</a>。</td>
</tr>

<tr>
<th>版本：</th>
<td>CSS3</td>
</tr>

<tr>
<th>JavaScript 语法：</th>
<td>object.style.translate=&quot;10px 20px&quot;</td>
</tr>
</table>
</section>



<section>
<h2>浏览器支持</h2>

<p>表格中的数字表示首个完全支持该属性的浏览器版本。</p>

<table class="browser-support">
<tr>
<th class="bsChrome">Chrome</th>
<th class="bsEdge">Edge</th>
<th class="bsFirefox">Firefox</th>
<th class="bsSafari">Safari</th>
<th class="bsOpera">Opera</th>
</tr>

<tr>
<td>104</td>
<td>104</td>
<td>72</td>
<td>14.1</td>
<td>90</td>
</tr>
</table>
</section>



<section>
<h2>相关页面</h2>

<p>CSS 教程：<a href="../css/css3_2dtransforms.html" title="CSS 2D 变换">CSS 2D 变换</a></p>

<p>CSS 教程：<a href="../css/css3_3dtransforms.html" title="CSS 3D 变换">CSS 3D 变换</a></p>

<p>CSS 参考：<a href="pr_scale.html" title="CSS scale 属性">CSS scale 属性</a></p>

<p>CSS 参考：<a href="pr_rotate.html" title="CSS rotate 属性">CSS rotate 属性</a></p>

<p>CSS 参考：<a href="pr_perspective.html" title="CSS perspective 属性">CSS perspective 属性</a></p>
</section>



<div class="prenextnav">
<ul class="prenext">
<li class="pre"><a href="pr_transition-timing-function.asp" title="CSS transition-timing-function 属性">transition-timing-function</a></li>
<li class="next"><a href="pr_unicode-bidi.asp" title="CSS unicode-bidi 属性">unicode-bidi</a></li>
</ul>
</div><div style="background-color:#fcfdf8; padding:0;">
<script async src="../../pagead2.googlesyndication.com/pagead/js/f.txt"></script>
<!-- W3School ���Ĺ�� -->
<ins class="adsbygoogle"
     style="display:inline-block;width:800px;height:250px"
     data-ad-client="ca-pub-3381531532877742"
     data-ad-slot="2086924285"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
</div>

</div>
<!-- maincontent end -->

<div id="sidebar">

<div id="tools">
<h5 id="tools_reference"><a href="index.html">CSS 参考手册</a></h5>
<h5 id="tools_example"><a href="../css/css_examples.html">CSS 实例</a></h5>
<h5 id="tools_quiz"><a href="../css/css_quiz.html">CSS 测验</a></h5>
<h5 id="tools_tutorial"><a href="../css/index.html">CSS 教程</a></h5>
</div>

<div id="sidebar_zzs">

<div id="sbtg">
<script async src="../../pagead2.googlesyndication.com/pagead/js/f.txt"></script>
<!-- W3School 侧栏广告位 -->
<ins class="adsbygoogle"
     style="display:inline-block;width:160px;height:600px"
     data-ad-client="ca-pub-3381531532877742"
     data-ad-slot="6744370501"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
</div>

</div>

</div>

<div id="footer">
<p id="p1">
W3School 简体中文版提供的内容仅用于培训和测试，不保证内容的正确性。通过使用本站内容随之而来的风险与本站无关。版权所有，保留一切权利。
</p>

<p id="p2">
<a href="../about/index.html" title="关于 W3School">关于 W3School</a>
<a href="../about/about_helping.html" title="帮助 W3School">帮助 W3School</a>
<a href="../about/about_use.html" title="关于使用">使用条款</a>
<a href="../about/about_privacy.html" title="关于隐私">隐私条款</a>
<a target="_blank" href="https://www.ykinvestment.com/">技术支持：赢科</a>
<a target="_blank" href="http://beian.miit.gov.cn/">蒙 ICP 备 06004630 号</a>
</p>
</div>


</div>
<!-- wrapper end -->


</body>


<!-- Mirrored from www.w3school.com.cn/cssref/pr_translate.asp by HTTrack Website Copier/3.x [XR&CO'2014], Fri, 20 Mar 2026 05:26:32 GMT -->
</html>