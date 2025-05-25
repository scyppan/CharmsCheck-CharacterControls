<?php

add_action('wp_ajax_nopriv_get_form_data', 'handle_form_data_proxy');
add_action('wp_ajax_get_form_data',      'handle_form_data_proxy');

function handle_form_data_proxy() {
  // ── CORS & OPTIONS ──
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type');
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
  }

  // ── Form whitelist ──
  $allowed_forms = [ '972','979','995','114','120','116','124',
                     '191','8','3','944','34','170','964',
                     '1085','126','48','53','2','43','908','67' ];
  $form = isset($_GET['form'])
        ? preg_replace('/[^0-9]/','', $_GET['form'])
        : null;
  if (! $form || ! in_array($form, $allowed_forms, true)) {
    http_response_code(403);
    echo json_encode(['error'=>'Unauthorized form']);
    wp_die();
  }

  $transient_key = "charms_form_{$form}";
  $force_bust    = (isset($_GET['bust']) && $_GET['bust']==='1');

  // ── Serve cached if available ──
  if (! $force_bust && false !== ($pruned = get_transient($transient_key))) {
    header('Content-Type: application/json');
    echo $pruned;
    wp_die();
  }

  // ── Fetch fresh ──
  $url  = "https://charmscheck.com/wp-json/frm/v2/forms/{$form}/entries?page_size=10000";
  $resp = wp_remote_get($url, [
    'headers'   => ['Authorization'=>'Basic PLACEHOLDER'],
    'timeout'   => 60,
    'sslverify' => true,
  ]);
  if (is_wp_error($resp)) {
    http_response_code(502);
    echo json_encode(['error'=>$resp->get_error_message()]);
    wp_die();
  }
  $code = wp_remote_retrieve_response_code($resp);
  $body = wp_remote_retrieve_body($resp);
  if ($code !== 200) {
    http_response_code($code);
    echo $body;
    wp_die();
  }

  // ── Prune JSON ──
  $data = json_decode($body, true);
  if (json_last_error()===JSON_ERROR_NONE) {
    prune_dataset($data);
    $pruned = json_encode($data);
  } else {
    // fallback to original if decode fails
    $pruned = $body;
  }

  // ── Cache pruned for 1 hour ──
  set_transient($transient_key, $pruned, HOUR_IN_SECONDS);

  header('Content-Type: application/json');
  echo $pruned;
  wp_die();
}

/**
 * Walks an array or object-of-objects and prunes each entry.
 */
function prune_dataset(&$dataset) {
  if (array_values($dataset) === $dataset) {
    // numerically indexed
    foreach ($dataset as &$entry) {
      prune_entry($entry);
    }
  } else {
    // associative (object) form
    foreach ($dataset as &$entry) {
      prune_entry($entry);
    }
  }
}

/**
 * Removes unused fields and empty placeholders from one entry.
 */
function prune_entry(&$entry) {
  // A) drop top-level keys
  foreach ([
    'ip','form_id','post_id','user_id','parent_item_id',
    'is_draft','updated_by','created_at','updated_at'
  ] as $k) {
    unset($entry[$k]);
  }

  // B) prune empty meta props
  if (! empty($entry['meta']) && is_array($entry['meta'])) {
    foreach ($entry['meta'] as $mk => $mv) {
      if ($mv === '' || $mv === 'No' || $mv === 0) {
        unset($entry['meta'][$mk]);
      }
    }
  }

  // C) remove any "-value" siblings
  foreach ($entry as $k => $_) {
    if (substr($k, -6) === '-value') {
      unset($entry[$k]);
    }
  }
}